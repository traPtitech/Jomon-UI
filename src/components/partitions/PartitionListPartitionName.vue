<script lang="ts" setup>
import { ref, toRef, watch } from 'vue'

import { CheckIcon, PencilIcon } from '@heroicons/vue/24/solid'

import BaseTextInput from '@/components/shared/BaseInput/BaseTextInput.vue'
import type { Partition } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'
import { useUserStore } from '@/features/user/store'

import { useEditor } from './composable/useEditor'

const { canEditPartition, editPartition } = usePartitionStore()
const { me, fetchMe, isMeFetched } = useUserStore()

const { partition } = defineProps<{
  partition: Partition
}>()

if (!isMeFetched.value) {
  await fetchMe()
}

const editedName = ref(partition.name)
watch(
  () => partition.name,
  newName => {
    if (!isEditMode.value) {
      editedName.value = newName
    }
  }
)

const { isEditMode, isSaving, handleSave } = useEditor(
  toRef(() => partition.name),
  editedName,
  () =>
    editPartition(partition.id, {
      ...partition,
      name: editedName.value,
    }),
  'パーティション名の更新に失敗しました'
)
</script>

<template>
  <div v-if="isEditMode" class="flex gap-2">
    <BaseTextInput
      v-model="editedName"
      label="パーティション名を編集"
      class="w-fit" />
    <button @click="handleSave" :disabled="isSaving">
      <CheckIcon class="h-4 w-4 text-text-secondary hover:text-text-primary" />
    </button>
  </div>
  <button
    v-else-if="canEditPartition(me)"
    @click="isEditMode = true"
    class="flex cursor-pointer items-baseline gap-2">
    {{ partition.name }}
    <PencilIcon class="h-3 w-3 text-text-secondary hover:text-text-primary" />
  </button>
  <span v-else>
    {{ partition.name }}
  </span>
</template>
