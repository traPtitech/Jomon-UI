<script lang="ts" setup>
import MarkdownIt from 'markdown-it'

type Props = { text: string }
const props = defineProps<Props>()
const md = MarkdownIt({
  breaks: true
})
</script>
<template>
  <div v-html="md.render(text)" class="prose"></div>
</template>
