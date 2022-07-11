<script lang="ts" setup>
import MarkdownIt from 'markdown-it'

interface Props {
  text: string
}
defineProps<Props>()
const md = MarkdownIt({
  breaks: true,
  linkify: true
})
</script>

<template>
  <!--eslint-disable-next-line vue/no-v-html-->
  <div class="prose max-w-full break-words" v-html="md.render(text)" />
</template>
