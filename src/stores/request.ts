import { ref } from 'vue'
import { defineComposable } from '/@/lib/store'
import type { Request, RequestQuerySeed } from '/@/features/request/model'

const defaultParams: RequestQuerySeed = {
  sort: 'created_at',
  currentStatus: '',
  target: '',
  since: '',
  until: '',
  limit: 10,
  offset: 0,
  tags: [],
  group: ''
}

export const useRequestStore = defineComposable('request', () => {
  const requests = ref<Request[]>([])
  const isRequestFetched = ref(false)

  const filterParams = ref<RequestQuerySeed>(defaultParams)

  return { requests, isRequestFetched, filterParams }
})
