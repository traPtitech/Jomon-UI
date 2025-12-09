<script lang="ts" setup>
import { computed, ref } from 'vue'

import { EyeIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

import SearchSelect from '@/components/shared/SearchSelect/SearchSelect.vue'

import BaseTextInput from './BaseInput/BaseTextInput.vue'
import MarkdownIt from './MarkdownIt.vue'

type TabType = 'input' | 'preview'
interface Props {
  label: string
  placeholder?: string
  templates?: readonly { name: string; value: string }[]
}

const model = defineModel<string>({ required: true })
const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
})

const currentTab = ref<TabType>('input')
const selectedTemplate = ref('')

const templateOptions = computed(
  () =>
    props.templates?.map(template => {
      return {
        label: template.name,
        key: template.name,
      }
    }) ?? []
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- FIXME: InputSelectSingleを直す
function setTemplate(template: Record<string, any> | string | null) {
  if (typeof template !== 'string') {
    return
  }
  const foundTemplate = props.templates?.find(t => t.name === template)
  if (foundTemplate !== undefined) {
    model.value = foundTemplate.value
  }
}
function changeCurrentTab(tab: TabType) {
  currentTab.value = tab
}
</script>

<template>
  <div
    class="flex h-3/5 min-h-25 flex-col rounded-sm border border-surface-secondary">
    <div
      class="flex items-center justify-between rounded-t bg-hover-secondary px-4 pt-3">
      <div class="flex items-center">
        <button
          :class="`h-15 rounded-t px-4 py-2 ${
            currentTab === 'input'
              ? 'border-x border-t border-surface-secondary bg-surface-primary'
              : 'bg-hover-secondary'
          }`"
          type="button"
          aria-label="入力"
          @click="changeCurrentTab('input')">
          <PencilSquareIcon class="w-6" />
        </button>
        <button
          :class="`h-15 rounded-t px-4 py-2 ${
            currentTab === 'preview'
              ? 'border-x border-t border-surface-secondary bg-surface-primary'
              : 'bg-hover-secondary'
          }`"
          type="button"
          aria-label="プレビュー"
          @click="changeCurrentTab('preview')">
          <EyeIcon class="w-6" />
        </button>
      </div>
      <SearchSelect
        v-if="props.templates !== undefined"
        class="inline-block"
        :model-value="selectedTemplate"
        :options="templateOptions"
        label="テンプレートを選択"
        @update:model-value="setTemplate($event)" />
    </div>
    <div class="h-3/5 px-5 py-3">
      <BaseTextInput
        v-if="currentTab === 'input'"
        v-model="model"
        textarea
        :label="props.label"
        class="h-full w-full resize-none overflow-y-auto"
        :placeholder="placeholder" />
      <MarkdownIt
        v-if="currentTab === 'preview'"
        class="h-full w-full overflow-y-scroll rounded-sm border border-surface-secondary px-3 py-2"
        :text="model" />
      <div class="flex justify-end pt-3">
        <slot />
      </div>
    </div>
  </div>
</template>
