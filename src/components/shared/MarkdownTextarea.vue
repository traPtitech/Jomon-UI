<script lang="ts" setup>
import { ref } from 'vue'

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

function changeCurrentTab(tab: TabType) {
  currentTab.value = tab
}
</script>

<template>
  <div>
    <div class="h-10 bg-gray-200 border border-zinc-300 rounded-t">
      <div class="h-8 mt-[7px] flex gap-2">
        <button
          :class="`w-18 ml-3 text-xs rounded-t border-zinc-300 ${
            currentTab === 'input'
              ? 'bg-white border-x border-t'
              : 'bg-gray-200 border-b'
          }`"
          @click.prevent="changeCurrentTab('input')">
          入力
        </button>
        <button
          :class="`w-18 text-xs rounded-t border-zinc-300 ${
            currentTab === 'preview'
              ? 'bg-white border-x border-t'
              : 'bg-gray-200 border-b'
          }`"
          @click.prevent="changeCurrentTab('preview')">
          プレビュー
        </button>
      </div>
    </div>
    <div
      class="px-5 py-3 box-border border-x border-b border-zinc-300 rounded-b">
      <InputTextarea
        v-if="currentTab === 'input'"
        :auto-focus="props.autoFocus"
        class="min-h-40 w-full"
        :model-value="props.modelValue"
        :placeholder="props.placeholder"
        @update:model-value="emit('update:modelValue', $event)" />
      <MarkdownIt
        v-if="currentTab === 'preview'"
        class="min-h-40 w-full overflow-y-scroll"
        :text="modelValue" />
    </div>
  </div>
</template>
