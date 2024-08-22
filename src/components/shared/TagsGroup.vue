<script lang="ts" setup>
import type { Tag } from '/@/features/tag/model'

interface Props {
  tags: Tag[]
  limit?: number
}

const props = withDefaults(defineProps<Props>(), { limit: 4 })

const slicedTags = props.tags.slice(0, props.limit)
const tagToolTip = props.tags.map(tag => tag.name).join(', ')
</script>

<template>
  <div :title="tagToolTip">
    <div
      v-for="tag in slicedTags"
      :key="tag.id"
      class="inline-block border-dark-600 rounded border p-0.5 mr-1.5 mb-1.5">
      {{ tag.name }}
    </div>
    <span v-if="limit !== 0 && tags.length > limit"> ...</span>
  </div>
</template>
