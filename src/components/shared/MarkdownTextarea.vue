<script lang="ts" setup>
import { computed, ref } from 'vue'

import InputSelect from './InputSelect.vue'
import InputTextarea from './InputTextarea.vue'
import MarkdownIt from './MarkdownIt.vue'

type TabType = 'input' | 'preview'

interface Props {
  placeholder?: string
  modelValue: string
  templates?: readonly { name: string; value: string }[]
}

const props = withDefaults(defineProps<Props>(), { placeholder: '' })
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const currentTab = ref<TabType>('input')
const selectedTemplate = ref('')

const templateOptions = computed(() => {
  return (
    props.templates?.map(template => {
      return {
        key: template.name,
        value: template.name
      }
    }) ?? []
  )
})

function setTemplate(template: string) {
  const foundTemplate = props.templates?.find(t => t.name === template)
  if (foundTemplate !== undefined) {
    emit('update:modelValue', foundTemplate.value)
  }
}

function changeCurrentTab(tab: TabType) {
  currentTab.value = tab
}
</script>

<template>
  <div class="rounded border border-zinc-200">
    <div
      class="flex gap-2 rounded-t border-b border-zinc-200 bg-zinc-100 px-2 pt-2">
      <!-- todo:ボタンの下はborder消したい -->
      <button
        :class="`w-20 rounded-t py-1 ${
          currentTab === 'input'
            ? 'border-x border-t border-zinc-200 bg-white'
            : 'bg-zinc-100'
        }`"
        @click.prevent="changeCurrentTab('input')">
        入力
      </button>
      <button
        :class="`w-20 rounded-t py-1 ${
          currentTab === 'preview'
            ? 'border-x border-t border-zinc-200 bg-white'
            : 'bg-zinc-100'
        }`"
        @click.prevent="changeCurrentTab('preview')">
        プレビュー
      </button>
      <InputSelect
        v-if="props.templates !== undefined"
        v-model="selectedTemplate"
        class="m-1 ml-auto inline-block w-1/3"
        :options="templateOptions"
        placeholder="テンプレートを選択"
        @option:selected="setTemplate(selectedTemplate)">
      </InputSelect>
    </div>
    <div class="px-2 pt-2 pb-12">
      <!-- todo:入力モードだけ下の幅が微妙に広いのをどうにかする -->
      <InputTextarea
        v-if="currentTab === 'input'"
        class="min-h-40 w-full bg-zinc-100"
        :model-value="modelValue"
        :placeholder="placeholder"
        @update:model-value="emit('update:modelValue', $event)" />
      <MarkdownIt
        v-if="currentTab === 'preview'"
        class="min-h-40 bg-background w-full rounded border border-gray-300 px-1"
        :text="modelValue" />
    </div>
  </div>
</template>
