<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import InputTextarea from '/@/components/shared/InputTextarea.vue'
import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { EditMode } from '/@/pages/composables/useRequestDetail'

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
  <div class="flex">
    <div v-if="!props.isEditMode && request" class="relative flex flex-grow">
      <MarkdownIt
        class="flex-grow border border-gray-300 pl-1"
        :text="request.content" />
      <SimpleButton
        v-if="hasAuthority"
        class="absolute -right-16"
        font-size="sm"
        padding="sm"
        @click="emit('changeEditMode', 'content')">
        編集
      </SimpleButton>
    </div>
    <div v-else class="relative flex flex-grow">
      <InputTextarea
        v-model="editedValue.content"
        class="flex-grow resize-none"
        placeholder="詳細" />
      <SimpleButton
        class="absolute -right-16"
        font-size="sm"
        padding="sm"
        @click.stop="emit('changeEditMode', '')">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
