<script lang="ts" setup>
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import type { RequestDetail } from '/@/lib/apis'

import EditButton from '/@/components/shared/EditButton.vue'
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
  <div v-if="!isEditMode" class="flex items-center">
    <span class="text-2xl">金額：{{ props.request.amount }}円</span>
    <EditButton
      v-if="hasAuthority"
      class="ml-1"
      @click="emit('changeEditMode', 'amount')" />
  </div>
  <div v-else class="flex items-center">
    金額：
    <input
      class="mr-1 w-24 p-1"
      placeholder="金額"
      type="text"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />円
    <SimpleButton
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
  </div>
</template>
