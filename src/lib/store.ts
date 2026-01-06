import { defineStore, storeToRefs } from 'pinia'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineStoreComposable<SS extends () => any>(
  id: string,
  storeSetup: SS
): () => ReturnType<SS> {
  const piniaStore = defineStore(id, storeSetup)

  return () => {
    const store = piniaStore()
    const storeRefs = storeToRefs(store)

    return { ...store, ...storeRefs } as ReturnType<SS>
  }
}
