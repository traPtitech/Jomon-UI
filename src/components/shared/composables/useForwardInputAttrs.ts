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

type ControlHTMLAttrs<T extends ControlType> = BaseControlAttrs<T> &
  Partial<DataAttributeRecord>

interface ForwardInputAttrsOptions<T extends ControlType = ControlType> {
  /**
   * コントロール要素の型。
   */
  controlType: T
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
   * 必要に応じて controlType を上書きして
   * コントロール側の属性だけを取得するヘルパ。
   */
  getControlAttrs: <K extends ControlType>(
    overrideType: K
  ) => ControlHTMLAttrs<K>
}

interface ForwardedInputAttrs<T extends ControlType> {
  frameAttrs: Attrs
  controlAttrs: ControlHTMLAttrs<T>
}

interface PartitionedForwardInputAttrs<T extends ControlType>
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
  frameKeySet: Set<string>
) => frameKeySet.has(key) || frameKeySet.has(normalizedKey)

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

const frameKeySet = buildFrameKeySet(['class', 'style'])
const controlAttrBlocklistSet = new Set(
  ['id', 'value'].map(normalizeAttributeKey)
)
const frameListenerSet = new Set(
  defaultFrameListenerKeys.map(normalizeListenerKey)
)

/**
 * 親コンポーネントから渡された attrs を
 * - フレーム要素に付与する属性 (frameAttrs)
 * - input / textarea に付与する属性 (controlAttrs)
 * に振り分ける低レベルユーティリティ。
 *
 * 前提:
 * - フレーム側に残す属性は frameKeySet（class / style を含む）で管理する。
 * - コントロール側に渡さない属性は controlAttrBlocklistSet（id / value を含む）で管理する。
 * - フレーム側に残すイベントリスナーは frameListenerSet で管理する。
 * - controlType は 'input' または 'textarea' で、AttrAliasMap の解決に使用する。
 *
 * 挙動の概要:
 * - aria-describedby:
 *   - matchesDescribedByKey(key) に該当する属性を集約し、空白区切りの文字列にまとめる。
 *   - 正規化に成功した場合のみ describedBy として保持し、
 *     controlAttrs['aria-describedby'] に反映する。
 *   - 元の aria-describedby 系の属性は frameAttrs / controlAttrs には残さない。
 *
 * - イベントリスナー:
 *   - listenerPattern (/^on[A-Z]/) にマッチするキーをリスナーとみなす。
 *   - normalizeListenerKey(key) が frameListenerSet に含まれる場合は frameAttrs に入れる。
 *   - それ以外のリスナーは controlAttrs に入れる。
 *
 * - その他の属性:
 *   - shouldStayOnFrame(...) が true の場合は frameAttrs に入れる。
 *   - controlAttrBlocklistSet に含まれるキーは controlAttrs には入れない。
 *   - それ以外は getControlAttrKey(...) でキーを正規化し、controlAttrs に入れる。
 */
export const partitionForwardInputAttrs = <T extends ControlType>(
  attrs: Attrs,
  controlType: T
): PartitionedForwardInputAttrs<T> => {
  const frameEntries: [string, unknown][] = []
  const controlAttrs = {} as ControlHTMLAttrs<T>
  const aliasMap = getAttrAliasMap(controlType)
  let describedBy: string | undefined

  for (const [key, value] of Object.entries(attrs)) {
    if (matchesDescribedByKey(key)) {
      const normalized = normalizeDescribedByValue(value)
      if (normalized !== undefined) {
        describedBy = describedBy ? `${describedBy} ${normalized}` : normalized
        assignControlAttr(controlAttrs, describedByAttrName, describedBy)
      }
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

    if (shouldStayOnFrame(key, normalizedKey, frameKeySet)) {
      frameEntries.push([key, value])
      continue
    }

    if (controlAttrBlocklistSet.has(normalizedKey)) {
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
export function useForwardInputAttrs<T extends ControlType>(
  options: ForwardInputAttrsOptions<T>
): UseForwardInputAttrsReturn<T> {
  const attrs = useAttrs()
  const { controlType } = options

  const forwardedAttrs = computed(() =>
    partitionForwardInputAttrs(attrs, controlType)
  )

  const describedByAttr = computed(() => forwardedAttrs.value.describedBy)

  const getControlAttrs = <K extends ControlType>(
    overrideType: K
  ): ControlHTMLAttrs<K> =>
    partitionForwardInputAttrs(attrs, overrideType).controlAttrs

  const frameAttrs = computed<Attrs>(() => forwardedAttrs.value.frameAttrs)
  const inputAttrs = computed<ControlHTMLAttrs<T>>(
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
  matchesDescribedByKey
}
