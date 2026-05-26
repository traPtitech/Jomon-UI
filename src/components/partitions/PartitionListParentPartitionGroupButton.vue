<script lang="ts" setup>
import { ref, toRef, watch } from 'vue'

import { CheckIcon, BriefcaseIcon } from '@heroicons/vue/24/solid'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import type { Partition } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'
import { useUserStore } from '@/features/user/store'

import { useEditor } from './composable/useEditor'

import { usePartitionGroupStore } from '@/features/partitionGroup/store'
const { partitionGroupOptions } = usePartitionGroupStore()

const { canEditPartition, editPartition } = usePartitionStore()
const { me, fetchMe, isMeFetched } = useUserStore()

const { partition } = defineProps<{
    partition: Partition
}>()

if (!isMeFetched.value) {
    await fetchMe()
}

const editedParentPartitionGroup = ref(partition.parentPartitionGroupId)
watch(
    () => partition.parentPartitionGroupId,
    newParentPartitionGroupId => {
        if (!isEditMode.value) {
            editedParentPartitionGroup.value = newParentPartitionGroupId
        }
    }
)

const { isEditMode, isSaving, handleSave } = useEditor(
    toRef(() => partition.parentPartitionGroupId),
    editedParentPartitionGroup,
    () =>
        editPartition(partition.id, {
            ...partition,
            parentPartitionGroupId: editedParentPartitionGroup.value,
        }),
    '親パーティショングループの更新に失敗しました'
)
</script>

<template>
    <div v-if="isEditMode" class="flex gap-2">
        <SearchSelect v-model="editedParentPartitionGroup" :options="partitionGroupOptions" required
            label="親パーティショングループを編集" />
        <button @click="handleSave" :disabled="isSaving">
            <CheckIcon class="h-4 w-4 text-text-secondary hover:text-text-primary" />
        </button>
    </div>
    <button v-else-if="canEditPartition(me)" @click="isEditMode = true"
        class="flex cursor-pointer items-baseline gap-2">
        <BriefcaseIcon class="h-3 w-3 text-text-secondary hover:text-text-primary" />
        &nbsp;
    </button>
</template>
