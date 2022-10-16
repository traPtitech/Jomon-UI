<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

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
  <div v-if="!props.isEditMode && request" class="flex flex-grow">
    <h1 class="flex-grow text-3xl">
      {{ request.title }}
    </h1>
    <SimpleButton
      v-if="hasAuthority"
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click="emit('changeEditMode', 'title')">
      編集
    </SimpleButton>
  </div>
  <div v-else class="flex flex-grow">
    <input
      v-model="editedValue.title"
      class="flex-grow rounded p-1"
      placeholder="タイトル"
      type="text" />
    <SimpleButton
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
  </div>
</template>
