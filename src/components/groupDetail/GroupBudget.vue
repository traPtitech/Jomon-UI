<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import EditButton from '/@/components/shared/EditButton.vue'
import InputNumber from '/@/components/shared/InputNumber.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  isEditMode: boolean
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
  (e: 'finishEditing'): void
}>()

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()

const { group, editedValue } = storeToRefs(groupDetailStore)
const { canEditGroup } = groupDetailStore
const { me } = storeToRefs(userStore)

const hasAuthority = canEditGroup(me.value)
</script>

<template>
  <div v-if="!isEditMode && group" class="flex items-center">
    予算：{{ group.budget }}円
    <EditButton
      v-if="hasAuthority"
      class="ml-1"
      :is-edit-mode="props.isEditMode"
      @click="emit('changeEditMode', 'budget')" />
  </div>
  <div v-else class="flex items-center">
    予算：
    <InputNumber
      v-model="editedValue.budget"
      auto-focus
      class="mr-1 w-24"
      :min="1"
      placeholder="金額" />円
    <SimpleButton
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click="emit('changeEditMode', '')">
      キャンセル
    </SimpleButton>
    <SimpleButton
      class="ml-2"
      :disabled="props.isSending"
      font-size="sm"
      padding="sm"
      type="success"
      @click="emit('finishEditing')">
      完了
    </SimpleButton>
  </div>
</template>
