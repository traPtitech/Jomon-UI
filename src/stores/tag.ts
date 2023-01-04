import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useTagStore = defineStore('tag', () => {
  const toast = useToast()

  const tags = ref<Tag[]>()
  const isTagFetched = ref(false)

  const tagOptions = computed(() => {
    return (
      tags.value?.map(tag => {
        return {
          key: tag.name,
          value: tag
        }
      }) ?? []
    )
  })
  const tagIdOptions = computed(() => {
    return (
      tags.value?.map(tag => {
        return {
          key: tag.name,
          value: tag.id
        }
      }) ?? []
    )
  })

  const fetchTags = async () => {
    try {
      tags.value = (await apis.getTags()).data
      isTagFetched.value = true
    } catch {
      toast.error('タグの取得に失敗しました')
    }
  }

  const createTagIfNotExist = async (containNewTags: Tag[]) => {
    const alreadyExists: Tag[] = []

    // idが空文字のタグは新しいタグなので新規作成する
    const promises: ReturnType<typeof apis.postTag>[] = []
    for (const tag of containNewTags) {
      if (tag.id === '') {
        promises.push(apis.postTag({ name: tag.name }))
      } else {
        alreadyExists.push(tag)
      }
    }

    try {
      const created = (await Promise.all(promises)).map(res => res.data)
      if (tags.value) {
        tags.value.push(...created)
      } else {
        tags.value = created
      }
      alreadyExists.push(...created)
    } catch {
      throw new Error('新規タグの作成に失敗しました')
    }

    return alreadyExists
  }

  const deleteTag = async (id: string) => {
    try {
      await apis.tagsTagIDDelete(id)
      tags.value = tags.value?.filter(tag => tag.id !== id)
      toast.success('タグを削除しました')
    } catch {
      toast.error('タグの削除に失敗しました')
    }
  }
  return {
    tags,
    isTagFetched,
    tagOptions,
    tagIdOptions,
    fetchTags,
    createTagIfNotExist,
    deleteTag
  }
})
