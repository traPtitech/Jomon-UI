import {
  getAttrAliasMap,
  isAriaAttributeKey,
  isDataAttributeKey,
  normalizeAttributeKey,
  toKebabCase,
  type AttrAliasMap,
  type ControlType
} from './runtimeAttrMap'
import type {
  ComputedRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes
} from 'vue'
import { computed, useAttrs } from 'vue'

type Attrs = Readonly<Record<string, unknown>>

type NativeControlAttrs<T extends ControlType> = T extends 'textarea'
  ? TextareaHTMLAttributes
  : InputHTMLAttributes

type BaseControlAttrs<T extends ControlType> = Partial<
  Omit<NativeControlAttrs<T>, 'id' | 'value'>
>

type DataAttributeValue = string | number | boolean | null | undefined

type DataAttributeRecord = Record<`data-${string}`, DataAttributeValue>

export type ControlHTMLAttrs<T extends ControlType> = BaseControlAttrs<T> &
  Partial<DataAttributeRecord>

export interface ForwardInputAttrsOptions {
  /**
   * 常にフレーム要素側へ残す属性キー。
   * ここで指定したキーと、その normalizeAttributeKey() 結果が対象。
   */
  frameKeys?: string[]
  /**
   * 接頭辞マッチでフレーム要素側へ残す属性キー。
   * 例: ["data-frame-"] を渡すと "data-frame-*" 系をフレームに残す。
   */
  frameKeyPrefixes?: string[]
  /**
   * フレーム要素側に残すイベントリスナーキー。
   * デフォルトの defaultFrameListenerKeys に追加される。
   */
  frameListenerKeys?: string[]
  /**
   * コントロール要素側には渡さない属性キー。
   * normalizeAttributeKey() 済みのキーと比較する。
   */
  blocklistKeys?: string[]
  /**
   * コントロール要素の型。
   * 未指定時は 'input' を前提としたエイリアス解決を行う。
   */
  controlType?: ControlType
}

interface UseForwardInputAttrsReturn<T extends ControlType> {
  /**
   * aria-describedby に集約した値。
   * 複数の aria-describedby が指定された場合は空白区切りで連結される。
   */
  describedByAttr: ComputedRef<string | undefined>
  /**
   * ラッパー要素 (フレーム) に渡す属性。
   */
  frameAttrs: ComputedRef<Attrs>
  /**
   * input / textarea に渡す属性。
   */
  inputAttrs: ComputedRef<ControlHTMLAttrs<T>>
  /**
   * 必要に応じて controlType や blocklist を上書きして
   * コントロール側の属性だけを取得するヘルパ。
   */
  getControlAttrs: <K extends ControlType = T>(
    overrideType?: K,
    extraBlocklistKeys?: string[]
  ) => ControlHTMLAttrs<K>
}

export interface ForwardedInputAttrs<T extends ControlType> {
  frameAttrs: Attrs
  controlAttrs: ControlHTMLAttrs<T>
}

export interface PartitionedForwardInputAttrs<T extends ControlType>
  extends ForwardedInputAttrs<T> {
  describedBy?: string
}

const listenerPattern = /^on[A-Z]/
const listenerModifierPattern =
  /(Once|Capture|Passive|Self|Ctrl|Shift|Alt|Meta|Stop|Prevent|Left|Middle|Right|Exact)+$/

const defaultFrameListenerKeys = [
  'onClick',
  'onDblclick',
  'onPointerdown',
  'onPointerup',
  'onPointerenter',
  'onPointerleave',
  'onPointercancel',
  'onMousedown',
  'onMouseup',
  'onMouseenter',
  'onMouseleave',
  'onMousemove',
  'onTouchstart',
  'onTouchend'
] satisfies readonly string[]

const assignControlAttr = <T extends ControlType>(
  target: ControlHTMLAttrs<T>,
  key: string,
  value: unknown
) => {
  ;(target as Record<string, unknown>)[key] = value
}

const buildFrameKeySet = (keys: readonly string[]) => {
  const set = new Set<string>()
  keys.forEach(key => {
    set.add(key)
    set.add(normalizeAttributeKey(key))
  })
  return set
}

const describedByAttrName = 'aria-describedby'

/**
 * 与えられたキーが aria-describedby を表すかどうかを判定する。
 *
 * 入力例:
 * - "aria-describedby" (ケバブケース)
 * - "ariaDescribedby"  (camelCase)
 *
 * normalizeAttributeKey と toKebabCase の両方で比較し、
 * 実質的に "aria-describedby" を意味しているキーかどうかだけを判定する。
 * 他の aria-* 属性は対象外。
 */
const matchesDescribedByKey = (key: string) =>
  normalizeAttributeKey(key) === describedByAttrName ||
  toKebabCase(key) === describedByAttrName

const stripListenerModifiers = (key: string): string =>
  key.replace(listenerModifierPattern, '')

const normalizeListenerKey = (key: string) =>
  normalizeAttributeKey(stripListenerModifiers(key))

const shouldStayOnFrame = (
  key: string,
  normalizedKey: string,
  frameKeySet: Set<string>,
  normalizedFrameKeyPrefixes: readonly string[]
) =>
  frameKeySet.has(key) ||
  frameKeySet.has(normalizedKey) ||
  normalizedFrameKeyPrefixes.some(prefix => normalizedKey.startsWith(prefix))

/**
 * テンプレート上の属性名から、コントロール要素に渡す属性名を決定する。
 *
 * 前提:
 * - aliasMap は registerAlias() で構築されている
 * - aliasMap には以下のキーで canonical 名が登録されている:
 *   - 小文字化されたキー
 *   - canonical そのもの
 *   - canonical を kebab-case にしたもの
 *
 * 動作:
 * - data-* / aria-* はそのままの属性名で返す
 * - それ以外は aliasMap を使って canonical なプロパティ名に揃える
 *   (例: "maxlength" / "max-length" / "maxLength" → "maxLength")
 * - aliasMap に存在しないキーは、そのままの key を返す
 */
const getControlAttrKey = (key: string, aliasMap: AttrAliasMap): string => {
  const lowerKey = normalizeAttributeKey(key)
  if (isDataAttributeKey(lowerKey)) {
    return lowerKey
  }
  if (isAriaAttributeKey(lowerKey)) {
    return lowerKey
  }
  const kebabKey = toKebabCase(key)
  return aliasMap[lowerKey] ?? aliasMap[kebabKey] ?? aliasMap[key] ?? key
}

const createDefaultFrameListenerSet = () =>
  new Set(defaultFrameListenerKeys.map(normalizeListenerKey))

/**
 * aria-describedby に渡された値を標準化する。
 *
 * - null / undefined: undefined を返す
 * - string: 前後の空白を削除し、空文字列なら undefined を返す
 * - string[]: 文字列要素のみをトリムし、空でない要素を空白区切りで連結して返す
 * - それ以外の型: 開発時 (テスト以外) は警告を出し、undefined を返す
 */
const normalizeDescribedByValue = (value: unknown): string | undefined => {
  if (value == null) {
    return undefined
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  }

  if (Array.isArray(value)) {
    const ids = value
      .filter((v): v is string => typeof v === 'string')
      .map(v => v.trim())
      .filter(v => v.length > 0)

    if (ids.length === 0) {
      return undefined
    }

    return ids.join(' ')
  }

  if (import.meta.env.DEV && import.meta.env.MODE !== 'test') {
    console.warn(
      '[useForwardInputAttrs] aria-describedby expects string or string[], got:',
      value
    )
  }

  return undefined
}

/**
 * 親コンポーネントから渡された attrs を
 * - フレーム要素に付与する属性 (frameAttrs)
 * - input / textarea に付与する属性 (controlAttrs)
 * に振り分ける。
 *
 * 以下のルールを一括で扱う:
 * - aria-describedby の集約とコントロール側への反映
 * - フレーム用キー / 接頭辞によるフレーム側への固定
 * - イベントリスナーのフレーム / コントロール振り分け
 * - ブロックリストによる除外
 * - AttrAliasMap を用いた属性名の正規化
 */
export const partitionForwardInputAttrs = <T extends ControlType>(
  attrs: Attrs,
  frameKeySet: Set<string>,
  blocklistSet: Set<string>,
  controlType: T,
  normalizedFrameKeyPrefixes: readonly string[],
  frameListenerSet: Set<string>
): PartitionedForwardInputAttrs<T> => {
  const frameEntries: [string, unknown][] = []
  const controlAttrs = {} as ControlHTMLAttrs<T>
  const aliasMap = getAttrAliasMap(controlType)
  let describedBy: string | undefined

  for (const [key, value] of Object.entries(attrs)) {
    if (matchesDescribedByKey(key)) {
      const normalized = normalizeDescribedByValue(value)

      if (normalized !== undefined) {
        // 既存値があれば空白区切りで連結して集約する
        describedBy = describedBy ? `${describedBy} ${normalized}` : normalized

        // コントロール側にも集約済みの値を反映する
        assignControlAttr(controlAttrs, describedByAttrName, describedBy)
      }

      // 変換できなかった値は無視する
      continue
    }

    const normalizedKey = normalizeAttributeKey(key)

    if (listenerPattern.test(key)) {
      const normalizedListenerKey = normalizeListenerKey(key)
      if (frameListenerSet.has(normalizedListenerKey)) {
        frameEntries.push([key, value])
      } else {
        assignControlAttr(controlAttrs, key, value)
      }
      continue
    }

    if (
      shouldStayOnFrame(
        key,
        normalizedKey,
        frameKeySet,
        normalizedFrameKeyPrefixes
      )
    ) {
      frameEntries.push([key, value])
      continue
    }

    if (blocklistSet.has(normalizedKey)) {
      continue
    }

    const controlKey = getControlAttrKey(key, aliasMap)
    assignControlAttr(controlAttrs, controlKey, value)
  }

  return {
    frameAttrs: Object.fromEntries(frameEntries),
    controlAttrs,
    describedBy
  }
}

/**
 * 親コンポーネントから渡された属性を、
 * ラッパー要素と input / textarea へ安全に振り分けるための composable。
 *
 * 主な挙動:
 * - class / style などの見た目関連をフレーム側に転送
 * - id / value などの管理対象の属性をコントロール側から除外
 * - data-* / aria-* 属性をそのままコントロール側へ転送
 * - AttrAliasMap を用いて input / textarea のプロパティ名のゆらぎを吸収
 * - aria-describedby を集約し、computed の describedByAttr として公開
 */
export function useForwardInputAttrs(
  options?: ForwardInputAttrsOptions & { controlType?: 'input' }
): UseForwardInputAttrsReturn<'input'>
export function useForwardInputAttrs(
  options: ForwardInputAttrsOptions & { controlType: 'textarea' }
): UseForwardInputAttrsReturn<'textarea'>
export function useForwardInputAttrs(
  options?: ForwardInputAttrsOptions
): UseForwardInputAttrsReturn<ControlType> {
  const attrs = useAttrs()

  const frameKeySet = buildFrameKeySet([
    'class',
    'style',
    ...(options?.frameKeys ?? [])
  ])

  const frameKeyPrefixes = options?.frameKeyPrefixes ?? []
  const normalizedFrameKeyPrefixes = frameKeyPrefixes.map(normalizeAttributeKey)

  const frameListenerSet = new Set(
    [...defaultFrameListenerKeys, ...(options?.frameListenerKeys ?? [])].map(
      normalizeListenerKey
    )
  )

  const blocklistSet = new Set(
    ['id', 'value', ...(options?.blocklistKeys ?? [])].map(
      normalizeAttributeKey
    )
  )

  const controlType = options?.controlType ?? 'input'

  const runPartition = <K extends ControlType = ControlType>(
    overrideType?: K,
    overrideBlocklist?: Set<string>
  ): PartitionedForwardInputAttrs<K> =>
    partitionForwardInputAttrs(
      attrs,
      frameKeySet,
      overrideBlocklist ?? blocklistSet,
      (overrideType ?? controlType) as K,
      normalizedFrameKeyPrefixes,
      frameListenerSet
    )

  const forwardedAttrs = computed(() => runPartition(controlType))

  const describedByAttr = computed(() => forwardedAttrs.value.describedBy)

  const getControlAttrs = <K extends ControlType = ControlType>(
    overrideType?: K,
    extraBlocklistKeys: string[] = []
  ): ControlHTMLAttrs<K> => {
    if (!overrideType && extraBlocklistKeys.length === 0) {
      return forwardedAttrs.value.controlAttrs as ControlHTMLAttrs<K>
    }
    const finalBlocklist = new Set(blocklistSet)
    extraBlocklistKeys.forEach(key =>
      finalBlocklist.add(normalizeAttributeKey(key))
    )

    const finalType = (overrideType ?? controlType) as K

    return runPartition(finalType, finalBlocklist).controlAttrs
  }

  const frameAttrs = computed<Attrs>(() => forwardedAttrs.value.frameAttrs)
  const inputAttrs = computed<ControlHTMLAttrs<ControlType>>(
    () => forwardedAttrs.value.controlAttrs
  )

  return {
    describedByAttr,
    frameAttrs,
    inputAttrs,
    getControlAttrs
  }
}

/**
 * テスト専用のユーティリティ。
 * 外部から直接利用することは想定していない。
 */
export const __useForwardInputAttrsTestUtils = {
  stripListenerModifiers,
  matchesDescribedByKey,
  createDefaultFrameListenerSet
}
