<script lang="ts" setup>
import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { RequestDetail } from '/@/lib/apis'
import { isCreater } from '/@/lib/authorityCheck'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'
import { useUserStore } from '/@/stores/user'

interface Props {
  request: RequestDetail
  isEditMode: boolean
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()

const hasAuthority = isCreater(userStore.me, props.request.created_by)
</script>

<template>
  <div class="flex w-3/5">
    詳細：
    <div v-if="!isEditMode" class="flex flex-grow items-end">
      <markdown-it
        class="h-32 flex-grow overflow-y-scroll border border-gray-300 pl-1"
        :text="props.request.content" />
      <simple-button
        v-if="hasAuthority"
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click="emit('changeEditMode', 'content')">
        編集
      </simple-button>
    </div>
    <div v-else class="flex flex-grow items-end">
      <textarea
        class="h-30 flex-grow resize-none p-1"
        placeholder="詳細"
        :value="props.value"
        @input="emit('input', ($event.target as HTMLTextAreaElement).value)" />
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="emit('changeEditMode', '')">
        完了
      </simple-button>
    </div>
  </div>
</template>
