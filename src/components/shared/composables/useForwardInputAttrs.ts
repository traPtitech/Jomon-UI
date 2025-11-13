import {
  getAttrAliasMap,
  isAriaAttributeKey,
  isDataAttributeKey,
  normalizeAttributeKey,
  toKebabCase,
  type AttrAliasMap,
  type ControlType
} from './runtimeAttrMap'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'vue'
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

export interface ForwardInputAttrsOptions<T extends ControlType = 'input'> {
  frameKeys?: string[]
  frameKeyPrefixes?: string[]
  frameListenerKeys?: string[]
  blocklistKeys?: string[]
  controlType?: T
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
 * 対応する入力例:
 * - "aria-describedby"        // 推奨されるケバブケース
 * - "ariaDescribedby"         // camelCase / 大文字小文字違い
 *
 * 判定には
 * - normalizeAttributeKey (小文字化)
 * - toKebabCase
 * を使い、実質的に "aria-describedby" かどうかを見ている。
 *
 * 他の aria-* 属性はここでは扱わない。
 * aria-describedby だけを特別扱いし、複数値の集約などを行うためのヘルパ。
 */
const matchesDescribedByKey = (key: string) =>
  normalizeAttributeKey(key) === describedByAttrName ||
  toKebabCase(key) === describedByAttrName

const stripListenerModifiers = (key: string): string =>
  key.replace(listenerModifierPattern, '')

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
 * - aliasMap は runtimeAttrMap.registerAlias() で構築されている
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
  new Set(defaultFrameListenerKeys.map(stripListenerModifiers))

const normalizeDescribedByValue = (value: unknown): string | undefined => {
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

export const partitionForwardInputAttrs = <T extends ControlType>(
  attrs: Attrs,
  frameKeySet: Set<string>,
  blocklistSet: Set<string>,
  controlType: T,
  frameKeyPrefixes: readonly string[],
  frameListenerSet: Set<string>
): PartitionedForwardInputAttrs<T> => {
  const frameEntries: [string, unknown][] = []
  const controlAttrs = {} as ControlHTMLAttrs<T>
  const aliasMap = getAttrAliasMap(controlType)
  const normalizedFrameKeyPrefixes = frameKeyPrefixes.map(normalizeAttributeKey)
  let describedBy: string | undefined

  for (const [key, value] of Object.entries(attrs)) {
    if (matchesDescribedByKey(key)) {
      const normalized = normalizeDescribedByValue(value)

      if (normalized !== undefined) {
        // 既存 describedBy と結合
        describedBy = describedBy ? `${describedBy} ${normalized}` : normalized

        // control 側にも同じ値を反映
        assignControlAttr(controlAttrs, describedByAttrName, describedBy)
      }

      // 変換できなかった値は無視
      continue
    }

    const normalizedKey = normalizeAttributeKey(key)

    if (listenerPattern.test(key)) {
      const normalizedListenerKey = stripListenerModifiers(key)
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

export const useForwardInputAttrs = <T extends ControlType = 'input'>(
  options?: ForwardInputAttrsOptions<T>
) => {
  const attrs = useAttrs()

  const frameKeySet = buildFrameKeySet([
    'class',
    'style',
    ...(options?.frameKeys ?? [])
  ])

  const frameKeyPrefixes = options?.frameKeyPrefixes ?? []

  const frameListenerSet = new Set(
    [...defaultFrameListenerKeys, ...(options?.frameListenerKeys ?? [])].map(
      stripListenerModifiers
    )
  )

  const blocklistSet = new Set(
    ['id', 'value', ...(options?.blocklistKeys ?? [])].map(
      normalizeAttributeKey
    )
  )

  const controlType: T = options?.controlType ?? ('input' as T)

  const runPartition = <K extends ControlType = T>(
    overrideType?: K,
    overrideBlocklist?: Set<string>
  ): PartitionedForwardInputAttrs<K> =>
    partitionForwardInputAttrs(
      attrs,
      frameKeySet,
      overrideBlocklist ?? blocklistSet,
      (overrideType ?? controlType) as K,
      frameKeyPrefixes,
      frameListenerSet
    )

  const forwardedAttrs = computed<PartitionedForwardInputAttrs<T>>(() =>
    runPartition()
  )

  const describedByAttr = computed(() => forwardedAttrs.value.describedBy)

  const getControlAttrs = <K extends ControlType = T>(
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
    return runPartition(overrideType, finalBlocklist).controlAttrs
  }

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

export const __useForwardInputAttrsTestUtils = {
  stripListenerModifiers,
  matchesDescribedByKey,
  createDefaultFrameListenerSet
}
