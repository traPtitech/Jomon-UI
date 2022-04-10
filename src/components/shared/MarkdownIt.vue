<script lang="ts" setup>
import MarkdownIt from 'markdown-it'

type Props = { text: string }
const props = defineProps<Props>()
const md = MarkdownIt({
  breaks: true
})
</script>

<template>
  <div class="text-sm prose break-words" v-html="md.render(text)"></div>
</template>
