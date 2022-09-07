<script lang="ts" setup>
import EditButton from '/@/components/shared/EditButton.vue'
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
  <div v-if="!isEditMode" class="flex items-center">
    <span class="text-2xl"> 金額：{{ props.request.amount }}円 </span>
    <edit-button
      v-if="hasAuthority"
      class="text-secondary"
      @click="emit('changeEditMode', 'amount')" />
  </div>
  <div v-else class="flex items-center">
    金額：
    <input
      class="w-24 p-1"
      placeholder="金額"
      type="text"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />円
    <simple-button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </simple-button>
  </div>
</template>
