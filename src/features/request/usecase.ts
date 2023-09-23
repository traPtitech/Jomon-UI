import { storeToRefs } from 'pinia'

import { useRequestStore } from '/@/stores/request'
import { useRequestDetailStore } from '/@/stores/requestDetail'

import type { RequestSeed } from '/@/features/request/model'
import { useRequestRepository } from '/@/features/request/repository'
import type { RequestStatusUnion } from '/@/features/requestStatus/model'

export const fetchRequests = async () => {
  const repository = useRequestRepository()
  const { requests, isRequestFetched } = storeToRefs(useRequestStore())

  if (isRequestFetched.value) return

  try {
    requests.value = await repository.fetchRequests()
    isRequestFetched.value = true
  } catch {
    throw new Error('申請一覧の取得に失敗しました')
  }
}

export const fetchRequest = async (id: string) => {
  const repository = useRequestRepository()
  const { request } = storeToRefs(useRequestDetailStore())

  try {
    request.value = await repository.fetchRequest(id)
  } catch {
    throw new Error('申請の取得に失敗しました')
  }
}

export const createRequest = async (request: RequestSeed) => {
  const repository = useRequestRepository()
  const { requests } = storeToRefs(useRequestStore())

  try {
    const res = await repository.createRequest(request)
    requests.value.unshift(res)
  } catch {
    throw new Error('申請の作成に失敗しました')
  }
}

export const editRequest = async (id: string, requestSeed: RequestSeed) => {
  const repository = useRequestRepository()
  const { request } = storeToRefs(useRequestDetailStore())
  if (!request.value) return

  try {
    const res = await repository.editRequest(id, requestSeed)
    request.value = res
  } catch {
    throw new Error('申請の更新に失敗しました')
  }
}

export const createComment = async (id: string, comment: string) => {
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

export const changeStatus = async (
  id: string,
  status: RequestStatusUnion,
  comment: string
) => {
  const repository = useRequestRepository()
  const { request } = storeToRefs(useRequestDetailStore())
  if (!request.value) return

  try {
    const res = await repository.editStatus(id, status, comment)
    request.value.status = res
  } catch {
    throw new Error('ステータスの変更に失敗しました')
  }
}
