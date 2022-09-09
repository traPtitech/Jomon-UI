<script lang="ts" setup>
import EditButton from '/@/components/shared/EditButton.vue'
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
  <div class="flex">
    詳細：
    <div v-if="!isEditMode" class="w-9/10 flex items-end">
      <markdown-it
        class="h-32 w-4/5 overflow-y-scroll border border-gray-300 pl-1"
        :text="props.request.content" />
      <edit-button
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'content')" />
    </div>
    <div v-else class="w-9/10">
      <textarea
        class="h-30 w-4/5 resize-none p-1"
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
