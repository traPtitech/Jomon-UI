import { useTagStore } from '/@/stores/tag'

import type { Tag } from './model'
import { useTagRepository } from './repository'

export const useFetchTagsUsecase = async () => {
  const repository = useTagRepository()
  const { tags, isTagFetched } = useTagStore()

  try {
    tags.value = await repository.fetchTags()
    isTagFetched.value = true
  } catch (e) {
    throw new Error('タグの取得に失敗しました: ' + e)
  }
}

// TODO: composablesでまとめる
export const createTagIfNotExistUsecase = async (
  containNewTags: Tag[]
): Promise<Tag[]> => {
  const repository = useTagRepository()
  const { tags } = useTagStore()

  const alreadyExists: Tag[] = []

  // idがないタグは新しいタグなので新規作成する
  const promises: ReturnType<typeof repository.createTag>[] = []
  for (const tag of containNewTags) {
    if (!tag.id) {
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

export const deleteTagsUsecase = async (ids: string[]) => {
  const repository = useTagRepository()
  const { tags } = useTagStore()

  try {
    const promises = ids.map(repository.deleteTag)
    await Promise.all(promises)
    tags.value = tags.value.filter(tag => !ids.includes(tag.id))
  } catch {
    throw new Error('タグの削除に失敗しました')
  }
}
