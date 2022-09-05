<script lang="ts" setup>
import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import FixButton from '/@/components/shared/FixButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import type { EditMode } from './GroupDetail.vue'

interface Props {
  group: GroupDetail
  isEditMode: boolean
  value: string
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
  <div v-if="!isEditMode" class="flex items-start">
    予算：{{ props.group.budget }}円
    <FixButton v-if="hasAuthority" @click="emit('changeEditMode', 'budget')" />
  </div>
  <div v-else>
    予算：
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
