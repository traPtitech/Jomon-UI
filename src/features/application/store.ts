import { computed, inject, ref } from 'vue'

import { defineStoreComposable } from '@/lib/store'

import { ApplicationRepositoryKey } from '@/di'
import type {
  Application,
  ApplicationDetail,
  ApplicationQuerySeed,
  ApplicationSeed,
} from '@/features/application/entities'
import type { ApplicationStatus } from '@/features/applicationStatus/entities'
import { useTagStore } from '@/features/tag/store'
import type { AsyncStatus } from '@/types'

const createDefaultApplicationSeed = (): ApplicationSeed => ({
  createdBy: '',
  title: '',
  content: '',
  tags: [],
  partition: '',
  targets: [],
})

const createDefaultParams = (): ApplicationQuerySeed => ({
  sort: 'created_at',
  currentStatus: '',
  target: '',
  since: '',
  until: '',
  limit: 10,
  offset: 0,
  tags: [],
  partition: '',
})

const dateRule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/

export const useApplicationStore = defineStoreComposable('application', () => {
  const repository = inject(ApplicationRepositoryKey)
  if (!repository) throw new Error('ApplicationRepository is not provided')

  const tagStore = useTagStore()

  const applications = ref<Application[]>([])
  const status = ref<AsyncStatus>('idle')
  const error = ref<string | null>(null)
  const filterParams = ref<ApplicationQuerySeed>(createDefaultParams())
  const currentApplication = ref<ApplicationDetail | null>(null)
  const editedValue = ref<ApplicationSeed>(createDefaultApplicationSeed())

  const hasApplicationDetail = computed(() => currentApplication.value !== null)
  const isApplicationFetched = computed(() => status.value === 'success')

  const resetFilters = () => {
    filterParams.value = createDefaultParams()
  }

  const clearCurrentApplication = () => {
    currentApplication.value = null
  }

  const fetchApplications = async () => {
    const { since, until } = filterParams.value

    if ((since && !dateRule.test(since)) || (until && !dateRule.test(until))) {
      throw new Error('日付はyyyy-MM-ddの形式で入力してください')
    }

    status.value = 'loading'
    error.value = null

    try {
      applications.value = await repository.fetchApplications(
        filterParams.value
      )
      status.value = 'success'
    } catch (e) {
      status.value = 'error'
      error.value =
        '申請一覧の取得に失敗しました: ' +
        (e instanceof Error ? e.message : String(e))
      throw new Error(error.value)
    }
  }

  const fetchApplication = async (id: string): Promise<ApplicationDetail> => {
    try {
      const application = await repository.fetchApplication(id)
      currentApplication.value = application
      return application
    } catch {
      throw new Error('申請の取得に失敗しました')
    }
  }

  const ensureApplication = async (id: string) => {
    if (currentApplication.value?.id === id) {
      return currentApplication.value
    }
    return await fetchApplication(id)
  }

  const createApplication = async (applicationSeed: ApplicationSeed) => {
    try {
      const application = await repository.createApplication(applicationSeed)
      applications.value.unshift(application)
      return application
    } catch {
      throw new Error('申請の作成に失敗しました')
    }
  }

  const editApplication = async (id: string, seed: ApplicationSeed) => {
    if (!currentApplication.value) {
      throw new Error('申請が読み込まれていません')
    }
    const tags = await tagStore.ensureTags(seed.tags)

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

    try {
      const res = await repository.editStatus(id, status, comment)
      currentApplication.value.status = res.status
      currentApplication.value.statuses.push(res)
      // 一覧にも反映（詳細ページを直接開いた場合は一覧に存在しないので何もしない）
      const existingApp = applications.value.find(app => app.id === id)
      if (existingApp) {
        existingApp.status = res.status
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
    status,
    error,
    isApplicationFetched,
    filterParams,
    currentApplication,
    editedValue,
    hasApplicationDetail,
    resetFilters,
    clearCurrentApplication,
    fetchApplications,
    ensureApplication,
    fetchApplication,
    createApplication,
    editApplication,
    createComment,
    changeStatus,
  }
})

export type ApplicationStore = ReturnType<typeof useApplicationStore>
