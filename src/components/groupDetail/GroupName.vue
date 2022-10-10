<script setup lang="ts">
import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import { useDeleteGroup } from '/@/components/groupDetail/composables/useDeleteGroup'
import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import FormInput from '/@/components/shared/FormInput.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  isEditMode: boolean
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()

const hasAuthority = userStore.isAdminOrGroupOwner(
  userStore.me,
  groupDetailStore.group.owners
)
const { isDeleting, deleteGroup } = useDeleteGroup()
</script>

<template>
  <div class="flex w-full items-center">
    <h1 v-if="!isEditMode" class="flex-grow text-3xl">
      {{ groupDetailStore.group.name }}
    </h1>
    <FormInput
      v-else
      v-model="groupDetailStore.editedValue.name"
      class="flex-grow"
      placeholder="グループ名" />
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
      @click.stop="deleteGroup(groupDetailStore.group.id)">
      グループを削除
    </SimpleButton>
  </div>
</template>
