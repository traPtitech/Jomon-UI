import { storeToRefs } from 'pinia'

import { useRequestStore } from '/@/stores/request'
import { useRequestDetailStore } from '/@/stores/requestDetail'

import type { RequestStatus } from '/@/features/requestStatus/model'

import type { RequestSeed } from './model'
import { useRequestRepository } from './repository'
import { createTagIfNotExistUsecase } from '/@/features/tag/usecase'

export const useFetchRequestsUsecase = async () => {
  const repository = useRequestRepository()
  const { requests, isRequestFetched, filterParams } =
    storeToRefs(useRequestStore())

  const rule = /^2[0-9]{3}-[0-9]{1,2}-[0-9]{1,2}$/
  if (
    (filterParams.value.since && !rule.test(filterParams.value.since)) ||
    (filterParams.value.until && !rule.test(filterParams.value.until))
  ) {
    throw new Error('日付はyyyy-MM-ddの形式で入力してください')
  }

  try {
    requests.value = await repository.fetchRequests(filterParams.value)
    isRequestFetched.value = true
  } catch {
    throw new Error('申請一覧の取得に失敗しました')
  }
}

export const useFetchRequestUsecase = async (id: string) => {
  const repository = useRequestRepository()

  try {
    return await repository.fetchRequest(id)
  } catch {
    throw new Error('申請の取得に失敗しました')
  }
}

export const createRequestUsecase = async (request: RequestSeed) => {
  const repository = useRequestRepository()
  const { requests } = storeToRefs(useRequestStore())

  try {
    const res = await repository.createRequest(request)
    requests.value.unshift(res)

    return res
  } catch {
    throw new Error('申請の作成に失敗しました')
  }
}

export const editRequestUsecase = async (
  id: string,
  _requestSeed: RequestSeed
) => {
  const repository = useRequestRepository()
  const { request } = storeToRefs(useRequestDetailStore())
  if (!request.value) return

  try {
    const tags = await createTagIfNotExistUsecase(_requestSeed.tags)
    const requestSeed = {
      ..._requestSeed,
      tags
    }
    const res = await repository.editRequest(id, requestSeed)
    request.value = res
  } catch {
    throw new Error('申請の更新に失敗しました')
  }
}

export const createCommentUsecase = async (id: string, comment: string) => {
  const repository = useRequestRepository()
  const { request } = storeToRefs(useRequestDetailStore())
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
  status: RequestStatus,
  comment: string
) => {
  const repository = useRequestRepository()
  const { request } = storeToRefs(useRequestDetailStore())
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
