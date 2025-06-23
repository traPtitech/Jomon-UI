import { ref } from 'vue'
import type {
  Application,
  ApplicationQuerySeed
} from '/@/features/application/model'
import { defineComposable } from '/@/lib/store'

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

export const useApplicationStore = defineComposable('application', () => {
  const applications = ref<Application[]>([])
  const isApplicationFetched = ref(false)

  const filterParams = ref<ApplicationQuerySeed>(defaultParams)

  return { applications, isApplicationFetched, filterParams }
})
