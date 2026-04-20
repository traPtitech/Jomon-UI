<script lang="ts" setup>
import { ref, toRef, watch } from 'vue'

import { CheckIcon, PencilIcon } from '@heroicons/vue/24/solid'

import BaseTextInput from '@/components/shared/BaseInput/BaseTextInput.vue'
import type { PartitionGroup } from '@/features/partitionGroup/entities'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
import { useUserStore } from '@/features/user/store'

import { useEditor } from './composable/useEditor'

const { canEditPartitionGroup, editPartitionGroup } = usePartitionGroupStore()
const { me, fetchMe, isMeFetched } = useUserStore()

const { partitionGroup } = defineProps<{
  partitionGroup: PartitionGroup
}>()

if (!isMeFetched.value) {
  await fetchMe()
}

const editedName = ref(partitionGroup.name)
watch(
  () => partitionGroup.name,
  newName => {
    if (!isEditMode.value) {
      editedName.value = newName
    }
  }
)

const { isEditMode, isSaving, handleSave } = useEditor(
  toRef(() => partitionGroup.name),
  editedName,
  () =>
    editPartitionGroup(partitionGroup.id, {
      ...partitionGroup,
      name: editedName.value,
    }),
  'パーティショングループ名の更新に失敗しました'
)
</script>

<template>
  <div v-if="isEditMode" class="flex gap-2">
    <BaseTextInput
      v-model="editedName"
      label="パーティショングループ名を編集"
      class="w-fit" />
    <button @click="handleSave" :disabled="isSaving">
      <CheckIcon class="h-4 w-4 text-text-secondary hover:text-text-primary" />
    </button>
  </div>
  <button
    v-else-if="canEditPartitionGroup(me)"
    @click="isEditMode = true"
    class="flex cursor-pointer items-baseline gap-2">
    {{ partitionGroup.name }}
    <PencilIcon class="h-3 w-3 text-text-secondary hover:text-text-primary" />
  </button>
  <span v-else>
    {{ partitionGroup.name }}
  </span>
</template>
