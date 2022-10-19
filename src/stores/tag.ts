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
  const postTags = async (requestTags: string[]) => {
    const postTagResults: ReturnType<typeof apis.postTag>[] = []
    let preTags: string[] = []
    // 以下の2パターンで場合分けしていて、条件式が1でtrue、2でfalseになる
    // 1. willPutRequest.tagsに入っているidがtagStore.tagsのタグのidと一致する
    // 2. タグが新規作成されて、そのタグ名がwillPutRequest.tagsに入っている
    // 2の場合にはタグ名がtagStore.tagsのタグidと一致することはないので、tagPostPromisesにpostTag関数がpushされる
    requestTags.forEach((tag: string) => {
      if (tags.value?.some(t => t.id === tag)) {
        preTags.push(tag)
        return
      }
      postTagResults.push(apis.postTag({ name: tag }))
    })
    try {
      preTags = preTags.concat(
        (await Promise.all(postTagResults)).map(
          (tag: AxiosResponse<Tag>) => tag.data.id
        )
      )
    } catch {
      toast.error('新規タグの作成に失敗しました')
      throw new Error('新規タグの作成に失敗しました')
    }
    return preTags
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
    postTags,
    deleteTag
  }
})
