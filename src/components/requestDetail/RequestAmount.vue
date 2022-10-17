<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import InputNumber from '/@/components/shared/InputNumber.vue'
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
  <div v-if="!props.isEditMode && request" class="flex items-center">
    <span class="text-2xl">金額：{{ request.amount }}円</span>
    <EditButton
      v-if="hasAuthority"
      class="ml-1"
      @click="emit('changeEditMode', 'amount')" />
  </div>
  <div v-else class="flex items-center">
    金額：
    <InputNumber
      v-model="editedValue.amount"
      class="mr-1 w-24"
      placeholder="金額"
      type="text" />円
    <SimpleButton
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
  </div>
</template>
