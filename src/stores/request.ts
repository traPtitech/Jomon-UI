import { ref } from 'vue'
import { defineComposable } from '/@/lib/store'
import type {
  Application,
  ApplicationQuerySeed
} from '/@/features/request/model'

const defaultParams: ApplicationQuerySeed = {
  sort: 'created_at',
  currentStatus: '',
  target: '',
  since: '',
  until: '',
  limit: 10,
  offset: 0,
  tags: [],
  partition: ''
}

export const useRequestStore = defineComposable('request', () => {
  const requests = ref<Application[]>([])
  const isRequestFetched = ref(false)

  const filterParams = ref<ApplicationQuerySeed>(defaultParams)

  return { requests, isRequestFetched, filterParams }
})
