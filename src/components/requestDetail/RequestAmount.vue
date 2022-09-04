<script lang="ts" setup>
import SimpleButton from '../shared/SimpleButton.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import type { RequestDetail } from '/@/lib/apis'
import { isCreater } from '/@/lib/authorityCheck'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

interface Props {
  request: RequestDetail
}

const props = defineProps<Props>()

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()

const hasAuthority = isCreater(userStore.me, props.request.created_by)
</script>

<template>
  <div
    v-if="!(requestDetailStore.editMode === 'amount')"
    class="flex items-center">
    <span class="text-2xl"> 金額：{{ props.request.amount }}円 </span>
    <edit-button
      v-if="hasAuthority"
      class="text-secondary"
      @click="requestDetailStore.changeEditMode('amount')" />
  </div>
  <div
    v-if="requestDetailStore.editMode === 'amount'"
    class="flex items-center">
    金額：
    <input
      v-model="requestDetailStore.editedValue.amount"
      class="w-24 p-1"
      placeholder="金額"
      type="text" />円
    <simple-button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="requestDetailStore.changeEditMode('')">
      完了
    </simple-button>
  </div>
</template>
