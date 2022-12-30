<script lang="ts" setup>
import { computed, ref } from 'vue'

import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'

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
      <InputSelectSingle
        v-if="props.templates !== undefined"
        v-model="selectedTemplate"
        class="m-1 ml-auto inline-block w-1/3"
        :options="templateOptions"
        placeholder="テンプレートを選択"
        @option:selected="setTemplate(selectedTemplate)">
      </InputSelectSingle>
    </div>
    <div>
      <InputTextarea
        v-if="currentTab === 'input'"
        class="min-h-40 w-full"
        :model-value="modelValue"
        :placeholder="placeholder"
        @update:model-value="emit('update:modelValue', $event)" />
      <MarkdownIt
        v-if="currentTab === 'preview'"
        class="min-h-40 w-full overflow-y-scroll border border-gray-500 px-1"
        :text="modelValue" />
    </div>
  </div>
</template>
