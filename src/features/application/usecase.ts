import { useApplicationStore } from '/@/stores/application'
import { useApplicationDetailStore } from '/@/stores/applicationDetail'

import type { ApplicationStatus } from '/@/features/applicationStatus/model'

import type { ApplicationSeed } from './model'
import { useApplicationRepository } from './repository'
import { createTagIfNotExistUsecase } from '/@/features/tag/usecase'

export const useFetchApplicationsUsecase = async () => {
  const repository = useApplicationRepository()
  const { applications, isApplicationFetched, filterParams } =
    useApplicationStore()

  const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
  if (
    (filterParams.value.since && !rule.test(filterParams.value.since)) ||
    (filterParams.value.until && !rule.test(filterParams.value.until))
  ) {
    throw new Error('日付はyyyy-MM-ddの形式で入力してください')
  }

  try {
    applications.value = await repository.fetchApplications(filterParams.value)
    isApplicationFetched.value = true
  } catch {
    throw new Error('申請一覧の取得に失敗しました')
  }
}

export const useFetchApplicationUsecase = async (id: string) => {
  const repository = useApplicationRepository()

  try {
    return await repository.fetchApplication(id)
  } catch {
    throw new Error('申請の取得に失敗しました')
  }
}

export const createApplicationUsecase = async (
  application: ApplicationSeed
) => {
  const repository = useApplicationRepository()
  const { applications } = useApplicationStore()

  try {
    const res = await repository.createApplication(application)
    applications.value.unshift(res)

    return res
  } catch {
    throw new Error('申請の作成に失敗しました')
  }
}

export const editApplicationUsecase = async (
  id: string,
  _applicationSeed: ApplicationSeed
) => {
  const repository = useApplicationRepository()
  const { application } = useApplicationDetailStore()
  if (!application.value) return

  try {
    const tags = await createTagIfNotExistUsecase(_applicationSeed.tags)
    const applicationSeed = {
      ..._applicationSeed,
      tags
    }
    const res = await repository.editApplication(id, applicationSeed)
    application.value = res
  } catch {
    throw new Error('申請の更新に失敗しました')
  }
}

export const createCommentUsecase = async (id: string, comment: string) => {
  const repository = useApplicationRepository()
  const { application } = useApplicationDetailStore()
  if (!application.value) return

  try {
    const res = await repository.createComment(id, comment)
    application.value.comments.push(res)
  } catch {
    throw new Error('コメントの作成に失敗しました')
  }
}

export const changeStatusUsecase = async (
  id: string,
  status: ApplicationStatus,
  comment: string
) => {
  const repository = useApplicationRepository()
  const { application } = useApplicationDetailStore()
  if (!application.value) return

  try {
    const res = await repository.editStatus(id, status, comment)
    application.value.status = res.status
    application.value.statuses.push(res)
    if (res.comment !== undefined) {
      application.value.comments.push(res.comment)
    }
  } catch {
    throw new Error('ステータスの変更に失敗しました')
  }
}
