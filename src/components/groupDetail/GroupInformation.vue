<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

import { useGroupDetailStore } from '/@/stores/groupDetail'

import GroupName from '/@/components/groupDetail/GroupName.vue'
import { useGroupInformation } from '/@/components/groupDetail/composables/useGroupInformation'

import GroupBudget from './GroupBudget.vue'
import GroupDescription from './GroupDescription.vue'

const groupDetailStore = useGroupDetailStore()

const { isSending, editMode, changeEditMode } = useGroupInformation()
</script>

<template>
  <div>
    <GroupName
      :is-edit-mode="editMode === 'name'"
      :is-sending="isSending"
      @change-edit-mode="changeEditMode($event)" />
    <GroupDescription
      class="mt-4"
      :is-edit-mode="editMode === 'description'"
      :is-sending="isSending"
      @change-edit-mode="changeEditMode($event)" />
    <GroupBudget
      class="mt-4"
      :is-edit-mode="editMode === 'budget'"
      :is-sending="isSending"
      @change-edit-mode="changeEditMode($event)" />
    <router-link
      class="mt-2 flex w-fit items-center"
      :to="`/transactions?group=${groupDetailStore.group.id}`">
      このグループの入出金記録へ
      <ArrowTopRightOnSquareIcon class="w-6" />
    </router-link>
  </div>
</template>
