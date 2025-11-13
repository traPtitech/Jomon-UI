export type ControlType = 'input' | 'textarea'

export type AttrAliasMap = Record<string, string | undefined>

type AliasCache = Partial<Record<ControlType, AttrAliasMap>>

const aliasCache: AliasCache = {}

const denyList = new Set([
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
  'tabStop',
  'tagName',
  'textContent'
])

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
 * この関数は getControlAttrKey とペアで使うことを前提にしており、
 * 次のキーで canonical 名へのマッピングを登録する:
 *
 * - `key` を小文字化したもの  (例: "maxlength" → "maxLength")
 * - `canonical` そのもの       (例: "maxLength" → "maxLength")
 * - `canonical` を kebab-case にしたもの (例: "maxLength" → "max-length")
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

const addManualAliases = (map: AttrAliasMap) => {
  Object.entries(manualAliases).forEach(([alias, canonical]) => {
    registerAlias(map, alias, canonical)
  })
}

const isCallable = (target: unknown): target is () => void =>
  typeof target === 'function'

const collectPrototypeNames = (proto: object | null | undefined) =>
  proto ? Object.getOwnPropertyNames(proto) : []

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

const buildAliasMap = (controlType: ControlType): AttrAliasMap | null => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // NOTE:
    // この実装はクライアント専用のDOMプロトタイプ列挙に依存している。
    // 現状のJomon UIはSSRを想定していないため、サーバー環境では空マップを返す実装となっている。
    // 将来的にSSRを導入する場合は追加の実装が必要。
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
      if (denyList.has(prop)) return
      try {
        const value = elementRecord[prop]
        if (isCallable(value)) return
        registerAlias(map, prop, prop)
      } catch {
        // ignore props that throw on access
      }
    })
  })

  addManualAliases(map)
  return map
}

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

export const isDataAttributeKey = (key: string): boolean =>
  key.startsWith('data-')
export const isAriaAttributeKey = (key: string): boolean =>
  key.startsWith('aria-')

export const __setAttrAliasMapForTesting = (
  controlType: ControlType,
  map: AttrAliasMap
) => {
  aliasCache[controlType] = map
}
