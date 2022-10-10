<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

import type { GroupDetail } from '/@/lib/apis'

import GroupName from '/@/components/groupDetail/GroupName.vue'
import { useGroupInformation } from '/@/components/groupDetail/composables/useGroupInformation'

import GroupBudget from './GroupBudget.vue'
import GroupDescription from './GroupDescription.vue'

interface Props {
  group: GroupDetail
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'fixGroup', value: GroupDetail): void
}>()

const { isSending, editMode, editedValue, changeEditMode } =
  useGroupInformation(props.group)
</script>

<template>
  <div>
    <GroupName
      :group="group"
      :is-edit-mode="editMode === 'name'"
      :is-sending="isSending"
      :value="editedValue.name"
      @change-edit-mode="changeEditMode($event, emit)"
      @input="editedValue.name = $event" />
    <GroupDescription
      class="mt-4"
      :group="group"
      :is-edit-mode="editMode === 'description'"
      :is-sending="isSending"
      :value="editedValue.description"
      @change-edit-mode="changeEditMode($event, emit)"
      @input="editedValue.description = $event" />
    <GroupBudget
      class="mt-4"
      :group="group"
      :is-edit-mode="editMode === 'budget'"
      :is-sending="isSending"
      :value="editedValue.budget"
      @change-edit-mode="changeEditMode($event, emit)"
      @input="editedValue.budget = $event" />
    <router-link
      class="mt-2 flex w-fit items-center"
      :to="`/transactions?group=${props.group.id}`">
      このグループの入出金記録へ
      <ArrowTopRightOnSquareIcon class="w-6" />
    </router-link>
  </div>
</template>
