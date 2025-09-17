import { defineStore, storeToRefs } from 'pinia'

import type { ApplicationStatus } from '@/features/applicationStatus/entities'
import { useTagStore } from '@/features/tag/store'
import { useApplicationRepository } from './data/repository'
import type {
  Application,
  ApplicationDetail,
  ApplicationQuerySeed,
  ApplicationSeed
} from './entities'

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

const createApplicationStore = defineStore('application', {
  state: () => ({
    applications: [] as Application[],
    isApplicationFetched: false,
    filterParams: createDefaultParams() as ApplicationQuerySeed,
    currentApplication: null as ApplicationDetail | null
  }),
  getters: {
    hasApplicationDetail: state => state.currentApplication !== null
  },
  actions: {
    resetFilters() {
      this.filterParams = createDefaultParams()
    },
    clearCurrentApplication() {
      this.currentApplication = null
    },
    async fetchApplications() {
      const repository = useApplicationRepository()
      const { since, until } = this.filterParams

      if (
        (since && !dateRule.test(since)) ||
        (until && !dateRule.test(until))
      ) {
        throw new Error('日付はyyyy-MM-ddの形式で入力してください')
      }

      try {
        this.applications = await repository.fetchApplications(
          this.filterParams
        )
        this.isApplicationFetched = true
      } catch (e) {
        throw new Error('申請一覧の取得に失敗しました: ' + e)
      }
    },
    async ensureApplication(id: string) {
      if (this.currentApplication && this.currentApplication.id === id) {
        return this.currentApplication
      }
      return await this.fetchApplication(id)
    },
    async fetchApplication(id: string) {
      const repository = useApplicationRepository()
      try {
        const application = await repository.fetchApplication(id)
        this.currentApplication = application
        return application
      } catch {
        throw new Error('申請の取得に失敗しました')
      }
    },
    async createApplication(applicationSeed: ApplicationSeed) {
      const repository = useApplicationRepository()
      try {
        const application = await repository.createApplication(applicationSeed)
        this.applications.unshift(application)
        return application
      } catch {
        throw new Error('申請の作成に失敗しました')
      }
    },
    async editApplication(id: string, seed: ApplicationSeed) {
      if (!this.currentApplication) return

      const tagStore = useTagStore()
      const tags = await tagStore.ensureTags(seed.tags)

      const repository = useApplicationRepository()
      try {
        const updated = await repository.editApplication(id, { ...seed, tags })
        this.currentApplication = updated
        const index = this.applications.findIndex(app => app.id === updated.id)
        if (index !== -1) {
          this.applications.splice(index, 1, updated)
        }
      } catch {
        throw new Error('申請の更新に失敗しました')
      }
    },
    async createComment(id: string, comment: string) {
      if (!this.currentApplication) return

      const repository = useApplicationRepository()
      try {
        const newComment = await repository.createComment(id, comment)
        this.currentApplication.comments.push(newComment)
      } catch {
        throw new Error('コメントの作成に失敗しました')
      }
    },
    async changeStatus(id: string, status: ApplicationStatus, comment: string) {
      if (!this.currentApplication) return

      const repository = useApplicationRepository()
      try {
        const res = await repository.editStatus(id, status, comment)
        this.currentApplication.status = res.status
        this.currentApplication.statuses.push(res)
        const listIndex = this.applications.findIndex(app => app.id === id)
        if (listIndex !== -1) {
          this.applications[listIndex] = {
            ...this.applications[listIndex],
            status: res.status
          }
        }
        if (res.comment !== undefined) {
          this.currentApplication.comments.push(res.comment)
        }
      } catch {
        throw new Error('ステータスの変更に失敗しました')
      }
    }
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
