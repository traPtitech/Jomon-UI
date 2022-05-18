<script lang="ts" setup>
import { ref } from 'vue'

import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import clubBudgetRequestTemplate from '/@/md/clubBudgetRequest.md?raw'
import travelingExpenseRequestTemplate from '/@/md/travelingExpenseRequest.md?raw'

interface Props {
  content: string
}
defineProps<Props>()

const emit = defineEmits<{ (e: 'input', value: string): void }>()
const selectedTemplate = ref(null)
const templates = [
  { name: '部費利用申請', value: 'clubBudgetRequest' },
  { name: '交通費申請', value: 'travelingExpenseRequest' }
]

function setTemplate(selectedTemplate: string | null) {
  if (selectedTemplate) {
    switch (selectedTemplate) {
      case 'clubBudgetRequest':
        emit('input', clubBudgetRequestTemplate)
        break
      case 'travelingExpenseRequest':
        emit('input', travelingExpenseRequestTemplate)
    }
  }
}
</script>

<template>
  <div class="text-right mr-20">
    <VueSelect
      v-model="selectedTemplate"
      class="w-1/3 inline-block"
      label="name"
      :options="templates"
      placeholder="テンプレートを選択"
      :reduce="(template:any) => template.value"
      @close="setTemplate(selectedTemplate)">
    </VueSelect>
  </div>
  <div class="flex flex-col">
    <label>詳細</label>
    <textarea
      class="h-40 border border-gray-300 resize-none p-1 rounded"
      :value="content"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />
  </div>
  <details class="mb-2">
    <summary>MDプレビュー</summary>
    <MarkdownIt
      class="w-full px-1"
      :class="content ? 'border border-gray-200' : ''"
      :text="content" />
  </details>
</template>
