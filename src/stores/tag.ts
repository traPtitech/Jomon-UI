import { ref, computed } from 'vue'
import { defineComposable } from '/@/lib/store'
import type { Tag } from '/@/features/tag/model'

export const useTagStore = defineComposable('tag', () => {
  const tags = ref<Tag[]>([])
  const isTagFetched = ref(false)

  const tagOptions = computed(() =>
    tags.value.map(tag => ({
      key: tag.name,
      value: tag
    }))
  )

  const tagIdOptions = computed(() =>
    tags.value.map(tag => ({
      key: tag.name,
      value: tag.id
    }))
  )

  return {
    tags,
    isTagFetched,
    tagOptions,
    tagIdOptions
  }
})
