<script lang="ts" setup>
import { Tag } from '/@/lib/apis'

type Props = { tags: Tag[]; limit: number } //1-indexedでlimitを指定
const props = withDefaults(defineProps<Props>(), { limit: 20 })
</script>
<template>
  <span
    v-for="(tag, index) in tags.slice(
      0,
      !(tags.length > limit) ? tags.length : limit
    )"
    :key="tag.id"
    class="border border-solid border-dark-600 rounded p-0.5"
    :class="index !== 0 ? 'ml-2' : ''"
    >{{ tag.name }}</span
  >
  <span v-if="limit !== 0 && tags.length > limit"> ...</span>
</template>
