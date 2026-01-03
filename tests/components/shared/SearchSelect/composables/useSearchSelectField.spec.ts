import type { App, ComponentPublicInstance } from 'vue'
import { createApp } from 'vue'

import { describe, expect, it } from 'vitest'

import { useSearchSelectField } from '@/components/shared/SearchSelect/composables/useSearchSelectField'

function withSetup<T>(composable: () => T): [T, App] {
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })
  app.mount(document.createElement('div'))
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [result!, app]
}

describe('useSearchSelectField', () => {
  it('initializes with default state', () => {
    const [{ isFocused, inputId, errorId }, app] = withSetup(() =>
      useSearchSelectField()
    )
    expect(isFocused.value).toBe(false)
    expect(inputId).toBeDefined()
    expect(errorId).toBe(`${inputId}-error`)
    app.unmount()
  })

  describe('handleFocusOut', () => {
    it('sets isFocused to false if relatedTarget is null (e.g. clicking outside window)', () => {
      const [{ isFocused, handleFocusOut }, app] = withSetup(() =>
        useSearchSelectField()
      )
      isFocused.value = true

      // Mock container
      const container = document.createElement('div')
      const containerRef = { $el: container } as ComponentPublicInstance

      const event = new FocusEvent('focusout', { relatedTarget: null })
      handleFocusOut(event, containerRef)

      expect(isFocused.value).toBe(false)
      app.unmount()
    })

    it('sets isFocused to false if relatedTarget is outside container', () => {
      const [{ isFocused, handleFocusOut }, app] = withSetup(() =>
        useSearchSelectField()
      )
      isFocused.value = true

      const container = document.createElement('div')
      const outsideButton = document.createElement('button')
      document.body.appendChild(container)
      document.body.appendChild(outsideButton)

      const containerRef = { $el: container } as ComponentPublicInstance

      const event = new FocusEvent('focusout', { relatedTarget: outsideButton })
      handleFocusOut(event, containerRef)

      expect(isFocused.value).toBe(false)
      app.unmount()
    })

    it('keeps isFocused true if relatedTarget is inside container', () => {
      const [{ isFocused, handleFocusOut }, app] = withSetup(() =>
        useSearchSelectField()
      )
      isFocused.value = true

      const container = document.createElement('div')
      const insideButton = document.createElement('button')
      container.appendChild(insideButton)
      document.body.appendChild(container)

      const containerRef = { $el: container } as ComponentPublicInstance

      const event = new FocusEvent('focusout', { relatedTarget: insideButton })
      handleFocusOut(event, containerRef)

      expect(isFocused.value).toBe(true)
      app.unmount()
    })

    it('sets isFocused to false if containerRef is invalid', () => {
      const [{ isFocused, handleFocusOut }, app] = withSetup(() =>
        useSearchSelectField()
      )
      isFocused.value = true

      handleFocusOut(new FocusEvent('focusout'), null)
      expect(isFocused.value).toBe(false)

      // @ts-expect-error Testing invalid input
      handleFocusOut(new FocusEvent('focusout'), { $el: {} })
      expect(isFocused.value).toBe(false)
      app.unmount()
    })
  })
})
