import { storeToRefs } from 'pinia'

import { useTagStore } from '/@/stores/tag'

import { useTagRepository } from '/@/features/tag/repository'

import type { Tag } from './model'

export const useFetchTags = async () => {
  const repository = useTagRepository()
  const { tags, isTagFetched } = storeToRefs(useTagStore())

  if (isTagFetched.value) return

  try {
    tags.value = await repository.fetchTags()
    isTagFetched.value = true
  } catch {
    throw new Error('タグの取得に失敗しました')
  }
}

// TODO: composablesでまとめる&空文字じゃなくてnullで判定する
export const createTagIfNotExist = async (containNewTags: Tag[]) => {
  const repository = useTagRepository()
  const { tags } = storeToRefs(useTagStore())

  const alreadyExists: Tag[] = []

  // idが空文字のタグは新しいタグなので新規作成する
  const promises: ReturnType<typeof repository.createTag>[] = []
  for (const tag of containNewTags) {
    if (tag.id === '') {
      promises.push(repository.createTag(tag.name))
    } else {
      alreadyExists.push(tag)
    }
  }

  try {
    const created = await Promise.all(promises)
    tags.value.push(...created)
    alreadyExists.push(...created)
  } catch {
    throw new Error('新規タグの作成に失敗しました')
  }

  return alreadyExists
}

export const deleteTag = async (id: string) => {
  const repository = useTagRepository()
  const { tags } = storeToRefs(useTagStore())

  try {
    await repository.deleteTag(id)
    tags.value = tags.value.filter(tag => tag.id !== id)
    // TODO: 使う側で出すtoast.success('タグを削除しました')
  } catch {
    throw new Error('タグの削除に失敗しました')
  }
}
