<script lang="ts" setup>
import type { Tag } from '/@/features/tag/model'

interface Props {
  tags: Tag[]
  limit?: number //1-indexedでlimitを指定
}

const props = withDefaults(defineProps<Props>(), { limit: 20 })

const slicedTags = props.tags.slice(
  0,
  !(props.tags.length > props.limit) ? props.tags.length : props.limit
)
const tagToolTip = props.tags.map(tag => tag.name).join(', ')
</script>

<template>
  <span
    v-for="(tag, index) in slicedTags"
    :key="tag.id"
    class="border-dark-600 rounded border p-0.5"
    :class="index !== 0 ? 'ml-2' : ''"
    :title="tagToolTip">
    {{ tag.name }}
  </span>
  <span v-if="limit !== 0 && tags.length > limit"> ...</span>
</template>
