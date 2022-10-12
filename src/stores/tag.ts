import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useTagStore = defineStore('tag', () => {
  const toast = useToast()

  const tags = ref<Tag[]>()
  const isTagFetched = ref(false)

  const fetchTags = async () => {
    try {
      tags.value = (await apis.getTags()).data
      isTagFetched.value = true
    } catch {
      toast.error('タグの取得に失敗しました')
    }
  }
  const postTag = async (tag: Tag) => {
    try {
      tags.value?.push((await apis.postTag(tag)).data)
    } catch {
      toast.error('タグの追加に失敗しました')
    }
  }
  const deleteTag = async (id: string) => {
    try {
      await apis.tagsTagIDDelete(id)
      tags.value = tags.value?.filter(tag => tag.id !== id)
    } catch {
      toast.error('タグの削除に失敗しました')
    }
  }
  return { tags, isTagFetched, fetchTags, postTag, deleteTag }
})
