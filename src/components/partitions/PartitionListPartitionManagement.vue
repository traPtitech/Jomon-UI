<script lang="ts" setup>
import { computed } from 'vue'

import { useToast } from 'vue-toastification'

import type { Partition } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'

const { editPartition } = usePartitionStore()
const toast = useToast()

const { partition } = defineProps<{
  partition: Partition
}>()

const selectedManagementState = computed({
  get() {
    return partition.management.state
  },
  set(newState) {
    editPartition(partition.id, {
      ...partition,
      management: {
        ...partition.management,
        state: newState,
      },
    }).catch((e: unknown) => {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error('パーティションの有効状態の更新に失敗しました')
      }
    })
  },
})
</script>

<template>
  <select
    v-model="selectedManagementState"
    class="cursor-pointer"
    aria-label="パーティションの使用可能状態を選択">
    <option value="available">使用可能</option>
    <option value="unavailable">使用不可</option>
  </select>
</template>
