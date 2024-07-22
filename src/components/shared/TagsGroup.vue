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
  <div class="flex items-center gap-2" :title="tagToolTip">
    <div
      v-for="tag in slicedTags"
      :key="tag.id"
      class="border-surface-secondary rounded border p-0.5">
      {{ tag.name }}
    </div>
    <span v-if="limit !== 0 && tags.length > limit"> ...</span>
  </div>
</template>
