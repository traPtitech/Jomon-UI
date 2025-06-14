import { useRequestStore } from '/@/stores/request'
import { useRequestDetailStore } from '/@/stores/requestDetail'

import type { ApplicationStatus } from '/@/features/requestStatus/model'

import type { ApplicationSeed } from './model'
import { useApplicationRepository } from './repository'
import { createTagIfNotExistUsecase } from '/@/features/tag/usecase'

export const useFetchRequestsUsecase = async () => {
  const repository = useApplicationRepository()
  const { requests, isRequestFetched, filterParams } = useRequestStore()

  const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
  if (
    (filterParams.value.since && !rule.test(filterParams.value.since)) ||
    (filterParams.value.until && !rule.test(filterParams.value.until))
  ) {
    throw new Error('日付はyyyy-MM-ddの形式で入力してください')
  }

  try {
    requests.value = await repository.fetchApplications(filterParams.value)
    isRequestFetched.value = true
  } catch {
    throw new Error('申請一覧の取得に失敗しました')
  }
}

export const useFetchRequestUsecase = async (id: string) => {
  const repository = useApplicationRepository()

  try {
    return await repository.fetchApplication(id)
  } catch {
    throw new Error('申請の取得に失敗しました')
  }
}

export const createRequestUsecase = async (application: ApplicationSeed) => {
  const repository = useApplicationRepository()
  const { requests } = useRequestStore()

  try {
    const res = await repository.createApplication(application)
    requests.value.unshift(res)

    return res
  } catch {
    throw new Error('申請の作成に失敗しました')
  }
}

export const editRequestUsecase = async (
  id: string,
  _applicationSeed: ApplicationSeed
) => {
  const repository = useApplicationRepository()
  const { request } = useRequestDetailStore()
  if (!request.value) return

  try {
    const tags = await createTagIfNotExistUsecase(_applicationSeed.tags)
    const applicationSeed = {
      ..._applicationSeed,
      tags
    }
    const res = await repository.editApplication(id, applicationSeed)
    request.value = res
  } catch {
    throw new Error('申請の更新に失敗しました')
  }
}

export const createCommentUsecase = async (id: string, comment: string) => {
  const repository = useApplicationRepository()
  const { request } = useRequestDetailStore()
  if (!request.value) return

  try {
    const res = await repository.createComment(id, comment)
    request.value.comments.push(res)
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
  const { request } = useRequestDetailStore()
  if (!request.value) return

  try {
    const res = await repository.editStatus(id, status, comment)
    request.value.status = res.status
    request.value.statuses.push(res)
    if (res.comment !== undefined) {
      request.value.comments.push(res.comment)
    }
  } catch {
    throw new Error('ステータスの変更に失敗しました')
  }
}
