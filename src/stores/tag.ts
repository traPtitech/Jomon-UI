import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: '2020講習会',
      created_at: '2022-04-17T05:47:48.187Z',
      updated_at: '2022-04-17T05:47:48.187Z'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
      name: '2021講習会',
      created_at: '2022-04-17T05:47:48.187Z',
      updated_at: '2022-04-17T05:47:48.187Z'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
      name: '2022講習会',
      created_at: '2022-04-17T05:47:48.187Z',
      updated_at: '2022-04-17T05:47:48.187Z'
    }
  ])
  const isTagFetched = ref(false)

  const fetchTags = async () => {
    try {
      tags.value = (await apis.getTags()).data
      isTagFetched.value = true
    } catch (err: any) {
      alert(err.message)
    }
  }
  const postTag = async (tag: Tag) => {
    try {
      await apis.postTag(tag)
    } catch (err: any) {
      alert(err.message)
    }
  }
  const deleteTag = async (id: string) => {
    try {
      await apis.tagsTagIDDelete(id)
    } catch (err: any) {
      alert(err.message)
    }
  }
  return { tags, isTagFetched, fetchTags, postTag, deleteTag }
})
