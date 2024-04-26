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
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  autoFocus: false
})
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const currentTab = ref<TabType>('input')
const selectedTemplate = ref('')

const templateOptions = computed(
  () =>
    props.templates?.map(template => {
      return {
        key: template.name,
        value: template.name
      }
    }) ?? []
)

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
  <div class="flex flex-col rounded border border-gray-300">
    <div
      class="flex items-center justify-between rounded-t bg-gray-200 px-4 pt-3">
      <div class="flex items-center">
        <button
          :class="`rounded-t py-2 px-6 ${
            currentTab === 'input'
              ? 'bg-white border-t border-x border-gray-300'
              : 'bg-gray-200'
          }`"
          @click="changeCurrentTab('input')">
          入力
        </button>
        <button
          :class="`rounded-t py-2 px-6 ${
            currentTab === 'preview'
              ? 'bg-white border-t border-x border-gray-300'
              : 'bg-gray-200'
          }`"
          @click="changeCurrentTab('preview')">
          プレビュー
        </button>
      </div>
      <InputSelectSingle
        v-if="props.templates !== undefined"
        v-model="selectedTemplate"
        class="inline-block"
        :options="templateOptions"
        placeholder="テンプレートを選択"
        @option:selected="setTemplate(selectedTemplate)">
      </InputSelectSingle>
    </div>
    <div class="px-5 py-3">
      <InputTextarea
        v-if="currentTab === 'input'"
        :auto-focus="autoFocus"
        class="min-h-40 w-full bg-gray-200"
        :model-value="modelValue"
        :placeholder="placeholder"
        @update:model-value="emit('update:modelValue', $event)" />
      <MarkdownIt
        v-if="currentTab === 'preview'"
        class="min-h-40 w-full overflow-y-scroll rounded bg-gray-200 border border-gray-300 px-3 py-2"
        :text="modelValue" />
      <div class="flex justify-end pt-3">
        <slot />
      </div>
    </div>
  </div>
</template>
