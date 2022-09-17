<script lang="ts" setup>
import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import FixButton from '/@/components/shared/FixButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  group: GroupDetail
  isEditMode: boolean
  value: string
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()

const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)
</script>

<template>
  <div v-if="!isEditMode" class="flex items-center">
    予算：{{ props.group.budget }}円
    <FixButton v-if="hasAuthority" @click="emit('changeEditMode', 'budget')" />
  </div>
  <div v-else class="flex items-center">
    予算：
    <input
      class="mr-1 w-24 p-1"
      placeholder="金額"
      type="text"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />円
    <SimpleButton
      class="ml-2 flex items-center"
      font-size="sm"
      :is-disabled="props.isSending"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
  </div>
</template>
