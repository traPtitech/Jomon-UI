import { type Ref } from 'vue'

export const useResourceFetcher = (
  isFetched: Ref<boolean>,
  fetcher: () => Promise<void>
) => {
  if (!isFetched.value) {
    fetcher().catch(err => {
      console.error('Failed to fetch resource:', err)
    })
  }
}
