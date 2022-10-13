<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import FormTextarea from '/@/components/shared/FormTextarea.vue'
import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'

interface Props {
  isEditMode: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()

const { request, editedValue } = storeToRefs(requestDetailStore)

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)
</script>

<template>
  <div class="flex w-3/5">
    詳細：
    <div v-if="!props.isEditMode && request" class="flex flex-grow items-end">
      <MarkdownIt
        class="h-32 flex-grow overflow-y-scroll border border-gray-300 pl-1"
        :text="request.content" />
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
      <FormTextarea
        v-model="editedValue.content"
        class="h-30 flex-grow resize-none"
        placeholder="詳細" />
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
