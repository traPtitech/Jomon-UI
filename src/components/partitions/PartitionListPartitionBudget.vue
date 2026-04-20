<script lang="ts" setup>
import { computed, ref, toRef, watch } from 'vue'

import { CheckIcon, PencilIcon } from '@heroicons/vue/24/solid'

import BaseNumberInput from '@/components/shared/BaseInput/BaseNumberInput.vue'
import type { Partition } from '@/features/partition/entities'
import { isBudgetSet } from '@/features/partition/lib/isBudgetSet'
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

const editedBudget = ref(partition.budget)
watch(
  () => partition.budget,
  newBudget => {
    if (!isEditMode.value) {
      editedBudget.value = newBudget
    }
  }
)

const { isEditMode, isSaving, handleSave } = useEditor(
  toRef(() => partition.budget),
  editedBudget,
  () =>
    editPartition(partition.id, {
      ...partition,
      budget: editedBudget.value,
    }),
  'パーティション予算の更新に失敗しました'
)

const budgetDisplay = computed(() => {
  if (isBudgetSet(partition.budget)) {
    return `予算 ${partition.budget.toLocaleString()} 円`
  }
  return '予算指定なし'
})
</script>

<template>
  <div v-if="isEditMode" class="flex gap-2">
    <BaseNumberInput
      v-model="editedBudget"
      label="パーティション予算を編集"
      class="w-fit" />
    <button @click="handleSave" :disabled="isSaving">
      <CheckIcon class="h-4 w-4 text-text-secondary hover:text-text-primary" />
    </button>
  </div>
  <button
    v-else-if="canEditPartition(me)"
    @click="isEditMode = true"
    class="flex cursor-pointer items-baseline gap-2">
    {{ budgetDisplay }}
    <PencilIcon class="h-3 w-3 text-text-secondary hover:text-text-primary" />
  </button>
  <span v-else>
    {{ budgetDisplay }}
  </span>
</template>
