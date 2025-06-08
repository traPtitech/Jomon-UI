<script lang="ts" setup>
import { computed, ref } from 'vue'
import InputTextarea from './InputTextarea.vue'
import MarkdownIt from './MarkdownIt.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'

type TabType = 'input' | 'preview'
interface Props {
  label: string
  placeholder?: string
  templates?: readonly { name: string; value: string }[]
}

const model = defineModel<string>({ required: true })
const props = withDefaults(defineProps<Props>(), {
  placeholder: ''
})

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
  <div class="flex flex-col rounded-sm border border-surface-secondary">
    <div
      class="flex items-center justify-between rounded-t bg-hover-secondary px-4 pt-3">
      <div class="flex items-center">
        <button
          :class="`rounded-t py-2 px-6 ${
            currentTab === 'input'
              ? 'bg-surface-primary border-t border-x border-surface-secondary'
              : 'bg-hover-secondary'
          }`"
          type="button"
          @click="changeCurrentTab('input')">
          入力
        </button>
        <button
          :class="`rounded-t py-2 px-6 ${
            currentTab === 'preview'
              ? 'bg-surface-primary border-t border-x border-surface-secondary'
              : 'bg-hover-secondary'
          }`"
          type="button"
          @click="changeCurrentTab('preview')">
          プレビュー
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
    <div class="px-5 py-3">
      <InputTextarea
        v-if="currentTab === 'input'"
        :label="props.label"
        class="min-h-40 w-full"
        :model-value="model"
        :placeholder="placeholder"
        @update:model-value="model = $event" />
      <MarkdownIt
        v-if="currentTab === 'preview'"
        class="min-h-40 w-full overflow-y-scroll rounded-sm border border-surface-secondary px-3 py-2"
        :text="model" />
      <div class="flex justify-end pt-3">
        <slot />
      </div>
    </div>
  </div>
</template>
