import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: '2020講習会',
      created_at: '2022-01-25T14:06:32.381Z',
      updated_at: '2022-01-25T14:06:32.381Z'
    },
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
      name: '2021講習会',
      created_at: '2022-01-27T14:06:32.381Z',
      updated_at: '2022-01-27T14:06:32.381Z'
    }
  ])
  const tag = ref<Tag>()

  const isTagFetched = ref(false)

  const fetchTags = async () => {
    tags.value = (await apis.getTags()).data
    isTagFetched.value = true
  }

  return {
    tags,
    tag,
    isTagFetched,
    fetchTags
  }
})
