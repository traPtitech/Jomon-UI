<script lang="ts" setup>
import MarkdownIt from 'markdown-it'

type Props = { text: string }
defineProps<Props>()

const md = MarkdownIt({
  breaks: true
})
</script>

<template>
  <div class="prose break-words text-sm" v-html="md.render(text)"></div>
</template>
