import { defineStore, storeToRefs } from 'pinia'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineComposable<Id extends string, SS extends () => any>(
  id: Id,
  storeSetup: SS
): () => ReturnType<SS> {
  const piniaStore = defineStore(id, storeSetup)

  return () => {
    const store = piniaStore()
    const storeRefs = storeToRefs(store) as ReturnType<SS>
    const composable = {} as ReturnType<SS>

    for (const key in store) {
      if (key in storeRefs) {
        composable[key] = storeRefs[key]
      } else {
        // @ts-expect-error Incorrect store typings
        composable[key] = store[key]
      }
    }

    return composable
  }
}
