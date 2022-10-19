import type { AxiosResponse } from 'axios'
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
  const postTag = async (tag: Tag) => {
    try {
      tags.value?.push((await apis.postTag(tag)).data)
      toast.success('タグを追加しました')
    } catch {
      toast.error('タグの追加に失敗しました')
    }
  }
  const createTagIfNotExist = async (requestTags: Tag[]) => {
    const postTagResults: ReturnType<typeof apis.postTag>[] = []
    let response: Tag[] = []
    // requestTagsに入っているtag.idが空文字であれば、タグを新規作成する
    // ↑によって、返り値の配列には必ずidのついたタグが入っている
    requestTags.forEach((tag: Tag) => {
      if (tags.value?.some(t => t.id === tag.id)) {
        response.push(tag)
        return
      }
      postTagResults.push(apis.postTag({ name: tag.name }))
    })
    try {
      const postTagResponses = (await Promise.all(postTagResults)).map(
        (res: AxiosResponse<Tag>) => res.data
      )
      response = response.concat(postTagResponses)
      tags.value?.concat(postTagResponses)
    } catch {
      toast.error('新規タグの作成に失敗しました')
      throw new Error('新規タグの作成に失敗しました')
    }
    return response
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
    fetchTags,
    postTag,
    createTagIfNotExist,
    deleteTag
  }
})
