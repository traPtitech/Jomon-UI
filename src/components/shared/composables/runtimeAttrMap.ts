export type ControlType = 'input' | 'textarea'

export type AttrAliasMap = Record<string, string | undefined>

type AliasCache = Partial<Record<ControlType, AttrAliasMap>>

const aliasCache: AliasCache = {}

/**
 * エイリアス構築時に無視する DOM プロパティの一覧。
 *
 * dataset や style など、属性転送の対象にしたくないプロパティを含める。
 */
const blocklist = new Set([
  'attributes',
  'childElementCount',
  'children',
  'classList',
  'className',
  'dataset',
  'innerHTML',
  'innerText',
  'localName',
  'namespaceURI',
  'outerHTML',
  'outerText',
  'ownerDocument',
  'parentElement',
  'previousElementSibling',
  'nextElementSibling',
  'style',
  'tabIndex',
  'tagName',
  'textContent'
])

/**
 * 自動検出だけではカバーしづらいプロパティの手動エイリアス。
 *
 * 例:
 * - "maxlength" → "maxLength"
 * - "readonly"  → "readOnly"
 */
const manualAliases: Record<
  string,
  keyof HTMLInputElement | keyof HTMLTextAreaElement
> = {
  maxlength: 'maxLength',
  minlength: 'minLength',
  readonly: 'readOnly',
  enterkeyhint: 'enterKeyHint',
  inputmode: 'inputMode'
}

export const toKebabCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()

export const normalizeAttributeKey = (key: string) => key.toLowerCase()

/**
 * 属性名エイリアス用マップにエントリーを登録するヘルパ。
 *
 * - `key` はエイリアスとして渡される任意の文字列
 * - `canonical` は最終的に使いたい正規化済みプロパティ名
 *
 * 次のキーで canonical 名へのマッピングを登録する:
 * - `key` を小文字化したもの
 * - `canonical` そのもの
 * - `canonical` を kebab-case にしたもの
 *
 * これにより、テンプレート上の属性名が
 * - 小文字
 * - camelCase
 * - kebab-case
 * のいずれで書かれていても、同じ canonical 名に解決される。
 */
const registerAlias = (map: AttrAliasMap, key: string, canonical: string) => {
  if (!key) return
  const lower = normalizeAttributeKey(key)
  if (!(lower in map)) {
    map[lower] = canonical
  }
  if (!(canonical in map)) {
    map[canonical] = canonical
  }
  const kebab = toKebabCase(canonical)
  if (!(kebab in map)) {
    map[kebab] = canonical
  }
}

/**
 * 手動エイリアスをマップに追加する。
 */
const addManualAliases = (map: AttrAliasMap) => {
  Object.entries(manualAliases).forEach(([alias, canonical]) => {
    registerAlias(map, alias, canonical)
  })
}

const isCallable = (target: unknown): target is () => void =>
  typeof target === 'function'

const collectPrototypeNames = (proto: object | null | undefined) =>
  proto ? Object.getOwnPropertyNames(proto) : []

/**
 * controlType に応じて、属性検出に利用するプロトタイプの一覧を返す。
 *
 * Element / HTMLElement / HTMLInputElement or HTMLTextAreaElement
 * を順に列挙する。
 */
const getPrototypes = (controlType: ControlType): object[] => {
  const basePrototypes: (object | undefined)[] = []

  if (typeof Element !== 'undefined') {
    basePrototypes.push(Element.prototype)
  }

  if (typeof HTMLElement !== 'undefined') {
    basePrototypes.push(HTMLElement.prototype)
  }

  const controlSpecificPrototype =
    controlType === 'input'
      ? typeof HTMLInputElement === 'undefined'
        ? undefined
        : HTMLInputElement.prototype
      : typeof HTMLTextAreaElement === 'undefined'
        ? undefined
        : HTMLTextAreaElement.prototype

  basePrototypes.push(controlSpecificPrototype)

  return basePrototypes.filter((proto): proto is object => Boolean(proto))
}

/**
 * 指定された controlType 向けの AttrAliasMap を構築する。
 *
 * DOM プロトタイプを列挙し、以下の条件を満たすプロパティを canonical 名として登録する:
 * - prop が空文字列でない
 * - "on" で始まらない (イベントリスナーを除外)
 * - blocklist に含まれていない
 * - アクセス時に例外を投げない
 * - 関数ではない
 *
 * SSR 環境など DOM が存在しない場合は null を返す。
 */
const buildAliasMap = (controlType: ControlType): AttrAliasMap | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // NOTE:
    // この実装は DOM プロトタイプ列挙に依存するためブラウザ環境専用。
    // サーバーサイドレンダリング環境では空マップを返す前提で設計している。
    // SSR を正式にサポートする場合は、別経路でエイリアスを構築する実装が必要。
    if (import.meta.env.DEV) {
      console.warn(
        '[runtimeAttrMap] getAttrAliasMap was called in a non-DOM environment; returning empty alias map.'
      )
    }
    return null
  }

  const element = document.createElement(
    controlType === 'input' ? 'input' : 'textarea'
  )
  const map: AttrAliasMap = Object.create(null)

  const prototypes = getPrototypes(controlType)

  const elementRecord = element as unknown as Record<string, unknown>

  prototypes.forEach(proto => {
    collectPrototypeNames(proto).forEach(prop => {
      if (!prop || prop.startsWith('on')) return
      if (blocklist.has(prop)) return
      try {
        const value = elementRecord[prop]
        if (isCallable(value)) return
        registerAlias(map, prop, prop)
      } catch {
        // アクセス時に例外を投げるプロパティは無視する
      }
    })
  })

  addManualAliases(map)
  return map
}

/**
 * controlType ごとの AttrAliasMap を取得する。
 *
 * - 初回呼び出し時は buildAliasMap() でマップを構築してキャッシュする
 * - DOM が存在しない環境では空マップをキャッシュして返す
 */
export const getAttrAliasMap = (controlType: ControlType) => {
  const cached = aliasCache[controlType]
  if (cached) {
    return cached
  }
  const built = buildAliasMap(controlType)
  const finalMap: AttrAliasMap = built ?? Object.create(null)
  aliasCache[controlType] = finalMap
  return finalMap
}

/**
 * 小文字化したキーが data-* で始まるかどうかを判定する。
 */
export const isDataAttributeKey = (key: string): boolean =>
  normalizeAttributeKey(key).startsWith('data-')

/**
 * 小文字化したキーが aria-* で始まるかどうかを判定する。
 */
export const isAriaAttributeKey = (key: string): boolean =>
  normalizeAttributeKey(key).startsWith('aria-')

/**
 * テスト用に、指定した controlType の AttrAliasMap を差し替える。
 */
export const __setAttrAliasMapForTesting = (
  controlType: ControlType,
  map: AttrAliasMap
) => {
  aliasCache[controlType] = map
}
