<script setup lang="ts">
import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import EditButton from '/@/components/shared/EditButton.vue'
import BaseInput from '/@/components/shared/BaseInput.vue'
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

const { me } = useUserStore()
const { canEditGroup, group, editedValue } = useGroupDetailStore()
</script>

<template>
  <div v-if="group" class="flex items-center gap-3">
    <h1 v-if="!props.isEditMode" class="grow text-2xl">
      {{ group.name }}
    </h1>
    <BaseInput
      v-else
      v-model="editedValue.name"
      label="グループ名"
      class="grow" />
    <SimpleButton
      v-if="isEditMode"
      font-size="base"
      padding="sm"
      @click="emit('finishEditing')">
      完了
    </SimpleButton>
    <EditButton
      v-if="canEditGroup(me)"
      :is-edit-mode="props.isEditMode"
      @click="
        props.isEditMode
          ? emit('changeEditMode', '')
          : emit('changeEditMode', 'name')
      " />
  </div>
</template>
