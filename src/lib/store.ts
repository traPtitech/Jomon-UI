import { defineStore, storeToRefs } from 'pinia'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineComposable<Id extends string, SS extends () => any>(
  id: Id,
  storeSetup: SS
): () => ReturnType<SS> {
  const piniaStore = defineStore(id, storeSetup)

  return () => {
    const store = piniaStore()
    const storeRefs = storeToRefs(store)

    return { ...store, ...storeRefs } as ReturnType<SS>
  }
}
