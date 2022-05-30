<script lang="ts" setup>
import { ref } from 'vue'

import MarkdownIt from './MarkdownIt.vue'
import VueSelect from './VueSelect.vue'

interface Props {
  placeholder?: string
  value: string
  templates?: { name: string; value: string }[]
}
type TabType = 'input' | 'preview'
const props = withDefaults(defineProps<Props>(), { placeholder: '' })

const emit = defineEmits<{ (e: 'input', value: string): void }>()
const currentTab = ref<TabType>('input')
const selectedTemplate = ref(null)

function setTemplate(template: string | null) {
  if (template !== null) {
    const foundTemplate = props.templates?.find(t => t.name === template)
    if (foundTemplate !== undefined) {
      emit('input', foundTemplate.value)
    }
  }
}

function changeCurrentTab(tab: TabType) {
  currentTab.value = tab
}
</script>

<template>
  <div class="flex gap-2">
    <button
      :class="`w-20 py-1 rounded-t ${
        currentTab === 'input' ? 'bg-gray-400' : 'bg-gray-200'
      }`"
      @click.prevent="() => changeCurrentTab('input')">
      入力
    </button>
    <button
      :class="`w-20 py-1 rounded-t ${
        currentTab === 'preview' ? 'bg-gray-400' : 'bg-gray-200'
      }`"
      @click.prevent="() => changeCurrentTab('preview')">
      プレビュー
    </button>
    <VueSelect
      v-if="templates !== undefined"
      v-model="selectedTemplate"
      class="w-1/3 inline-block ml-auto m-1"
      label="name"
      :options="templates"
      placeholder="テンプレートを選択"
      :reduce="(template:any) => template.name"
      @close="setTemplate(selectedTemplate)">
    </VueSelect>
  </div>
  <div>
    <textarea
      v-if="currentTab === 'input'"
      class="min-h-40 w-full p-1 rounded-b"
      :placeholder="placeholder"
      :value="value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />
    <div
      v-if="currentTab === 'preview'"
      class="h-40 w-full border border-gray-500 p-1 overflow-y-scroll">
      <MarkdownIt :text="value" />
    </div>
  </div>
</template>
