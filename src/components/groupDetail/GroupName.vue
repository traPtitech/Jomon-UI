<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/solid'

import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import { useDeleteGroup } from '/@/components/groupDetail/composables/useDeleteGroup'
import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
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
const { isDeleting, deleteGroup } = useDeleteGroup()
</script>

<template>
  <div class="flex w-full items-center">
    <h1 v-if="!isEditMode" class="flex-grow text-3xl">
      {{ props.group.name }}
    </h1>
    <input
      v-else
      class="flex-grow rounded p-1"
      placeholder="グループ名"
      type="text"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />
    <SimpleButton
      v-if="hasAuthority && !isEditMode"
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click="emit('changeEditMode', 'name')">
      編集
    </SimpleButton>
    <SimpleButton
      v-else
      :class="`ml-2 flex items-center ${props.isSending && 'px-3'}`"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      <span v-if="!props.isSending">完了</span>
      <ArrowPathIcon v-else class="w-5 animate-spin" />
    </SimpleButton>
    <SimpleButton
      v-if="hasAuthority"
      :class="`mx-2 flex items-center ${isDeleting && 'px-10'}`"
      font-size="sm"
      kind="danger"
      padding="sm"
      @click.stop="deleteGroup(props.group.id)">
      <span v-if="!isDeleting">グループを削除</span>
      <ArrowPathIcon v-else class="w-5 animate-spin" />
    </SimpleButton>
  </div>
</template>
