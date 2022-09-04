<script lang="ts" setup>
import SimpleButton from '../shared/SimpleButton.vue'
import type { EditMode } from './GroupDetail.vue'
import FixButton from '/@/components/shared/FixButton.vue'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'
import { useUserStore } from '/@/stores/user'

interface Props {
  group: GroupDetailType
  editMode: EditMode
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
  <div v-if="!(editMode === 'budget')" class="flex items-start">
    予算：{{ props.group.budget }}円
    <fix-button v-if="hasAuthority" @click="emit('changeEditMode', 'budget')" />
  </div>
  <div v-if="editMode === 'budget'">
    予算：<input
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
