<script setup lang="ts">
import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import { useDeleteGroup } from '/@/components/groupDetail/composables/useDeleteGroup'
import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import FormInput from '/@/components/shared/FormInput.vue'
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
    <FormInput
      v-else
      class="flex-grow"
      placeholder="グループ名"
      :value="props.value"
      @input="emit('input', $event)" />
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
      class="ml-2 flex items-center"
      font-size="sm"
      :is-disabled="props.isSending"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
    <SimpleButton
      v-if="hasAuthority"
      class="mx-2 flex items-center"
      font-size="sm"
      :is-disabled="isDeleting"
      kind="danger"
      padding="sm"
      @click.stop="deleteGroup(props.group.id)">
      グループを削除
    </SimpleButton>
  </div>
</template>
