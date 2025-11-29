import { useApplicationRepository } from './data/repository'
import type {
  Application,
  ApplicationDetail,
  ApplicationQuerySeed,
  ApplicationSeed
} from './entities'
import type { ApplicationStatus } from '@/features/applicationStatus/entities'
import { useTagStore } from '@/features/tag/store'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const createDefaultParams = (): ApplicationQuerySeed => ({
  sort: 'created_at',
  currentStatus: '',
  target: '',
  since: '',
  until: '',
  limit: 10,
  offset: 0,
  tags: [],
  partition: ''
})

const dateRule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/

const createApplicationStore = defineStore('application', () => {
  const applications = ref<Application[]>([])
  const isApplicationFetched = ref(false)
  const filterParams = ref<ApplicationQuerySeed>(createDefaultParams())
  const currentApplication = ref<ApplicationDetail | null>(null)

  const hasApplicationDetail = computed(() => currentApplication.value !== null)

  const resetFilters = () => {
    filterParams.value = createDefaultParams()
  }

  const clearCurrentApplication = () => {
    currentApplication.value = null
  }

  const fetchApplications = async () => {
    const repository = useApplicationRepository()
    const { since, until } = filterParams.value

    if ((since && !dateRule.test(since)) || (until && !dateRule.test(until))) {
      throw new Error('日付はyyyy-MM-ddの形式で入力してください')
    }

    try {
      applications.value = await repository.fetchApplications(
        filterParams.value
      )
      isApplicationFetched.value = true
    } catch (e) {
      throw new Error(
        '申請一覧の取得に失敗しました: ' +
          (e instanceof Error ? e.message : String(e))
      )
    }
  }

  const ensureApplication = async (id: string) => {
    if (currentApplication.value?.id === id) {
      return currentApplication.value
    }
    return await fetchApplication(id)
  }

  const fetchApplication = async (id: string) => {
    const repository = useApplicationRepository()
    try {
      const application = await repository.fetchApplication(id)
      currentApplication.value = application
      return application
    } catch {
      throw new Error('申請の取得に失敗しました')
    }
  }

  const createApplication = async (applicationSeed: ApplicationSeed) => {
    const repository = useApplicationRepository()
    try {
      const application = await repository.createApplication(applicationSeed)
      applications.value.unshift(application)
      return application
    } catch {
      throw new Error('申請の作成に失敗しました')
    }
  }

  const editApplication = async (id: string, seed: ApplicationSeed) => {
    if (!currentApplication.value) return

    const tagStore = useTagStore()
    const tags = await tagStore.ensureTags(seed.tags)

    const repository = useApplicationRepository()
    try {
      const updated = await repository.editApplication(id, { ...seed, tags })
      currentApplication.value = updated
      const index = applications.value.findIndex(app => app.id === updated.id)
      if (index !== -1) {
        applications.value.splice(index, 1, updated)
      }
    } catch {
      throw new Error('申請の更新に失敗しました')
    }
  }

  const createComment = async (id: string, comment: string) => {
    if (!currentApplication.value) return

    const repository = useApplicationRepository()
    try {
      const newComment = await repository.createComment(id, comment)
      currentApplication.value.comments.push(newComment)
    } catch {
      throw new Error('コメントの作成に失敗しました')
    }
  }

  const changeStatus = async (
    id: string,
    status: ApplicationStatus,
    comment: string
  ) => {
    if (!currentApplication.value) return

    const repository = useApplicationRepository()
    try {
      const res = await repository.editStatus(id, status, comment)
      currentApplication.value.status = res.status
      currentApplication.value.statuses.push(res)
      const listIndex = applications.value.findIndex(app => app.id === id)
      if (listIndex !== -1) {
        applications.value[listIndex] = {
          ...applications.value[listIndex],
          status: res.status
        }
      }
      if (res.comment !== undefined) {
        currentApplication.value.comments.push(res.comment)
      }
    } catch {
      throw new Error('ステータスの変更に失敗しました')
    }
  }

  return {
    applications,
    isApplicationFetched,
    filterParams,
    currentApplication,
    hasApplicationDetail,
    resetFilters,
    clearCurrentApplication,
    fetchApplications,
    ensureApplication,
    fetchApplication,
    createApplication,
    editApplication,
    createComment,
    changeStatus
  }
})

export const useApplicationStore = () => {
  const store = createApplicationStore()
  const refs = storeToRefs(store)

  return {
    ...refs,
    resetFilters: store.resetFilters,
    clearCurrentApplication: store.clearCurrentApplication,
    fetchApplications: store.fetchApplications,
    ensureApplication: store.ensureApplication,
    fetchApplication: store.fetchApplication,
    createApplication: store.createApplication,
    editApplication: store.editApplication,
    createComment: store.createComment,
    changeStatus: store.changeStatus
  }
}

export type ApplicationStore = ReturnType<typeof useApplicationStore>
