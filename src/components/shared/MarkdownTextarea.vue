<script lang="ts" setup>
import { computed, ref } from 'vue'

import FormSelect from './FormSelect.vue'
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
  <div>
    <div class="flex gap-2">
      <button
        :class="`w-20 rounded-t py-1 ${
          currentTab === 'input' ? 'bg-gray-400 text-white' : 'bg-gray-200'
        }`"
        @click.prevent="changeCurrentTab('input')">
        入力
      </button>
      <button
        :class="`w-20 rounded-t py-1 ${
          currentTab === 'preview' ? 'bg-gray-400 text-white' : 'bg-gray-200'
        }`"
        @click.prevent="changeCurrentTab('preview')">
        プレビュー
      </button>
      <FormSelect
        v-if="props.templates !== undefined"
        v-model="selectedTemplate"
        class="m-1 ml-auto inline-block w-1/3"
        :options="templateOptions"
        placeholder="テンプレートを選択"
        @option:selected="setTemplate(selectedTemplate)">
      </FormSelect>
    </div>
    <div>
      <textarea
        v-if="currentTab === 'input'"
        class="min-h-40 w-full rounded-b p-1"
        :placeholder="placeholder"
        :value="modelValue"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        " />
      <div
        v-if="currentTab === 'preview'"
        class="h-40 w-full overflow-y-scroll border border-gray-500 p-1">
        <MarkdownIt :text="modelValue" />
      </div>
    </div>
  </div>
</template>
