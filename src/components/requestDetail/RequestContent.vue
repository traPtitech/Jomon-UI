<script lang="ts" setup>
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import type { RequestDetail } from '/@/lib/apis'

import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'

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
const requestDetailStore = useRequestDetailStore()

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)
</script>

<template>
  <div class="flex w-3/5">
    詳細：
    <div v-if="!isEditMode" class="flex flex-grow items-end">
      <MarkdownIt
        class="h-32 flex-grow overflow-y-scroll border border-gray-300 pl-1"
        :text="props.request.content" />
      <SimpleButton
        v-if="hasAuthority"
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click="emit('changeEditMode', 'content')">
        編集
      </SimpleButton>
    </div>
    <div v-else class="flex flex-grow items-end">
      <textarea
        class="h-30 flex-grow resize-none p-1"
        placeholder="詳細"
        :value="props.value"
        @input="emit('input', ($event.target as HTMLTextAreaElement).value)" />
      <SimpleButton
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="emit('changeEditMode', '')">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
