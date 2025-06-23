<script lang="ts" setup>
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import { computed, ref } from 'vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import { usePartitionStore } from '/@/stores/partition'
import { editRequestUsecase } from '/@/features/request/usecase'
import type { ApplicationDetail } from '/@/features/request/model'
import { useRequest } from '/@/features/request/composables'
import { useToast } from 'vue-toastification'

const request = defineModel<ApplicationDetail>('modelValue', { required: true })

const { me } = useUserStore()
const { partitionOptions } = usePartitionStore()
const { isRequestCreator } = useRequest(request.value)
const toast = useToast()

const hasAuthority = isRequestCreator.value(me.value)

const defaultPartition = computed(() =>
  request.value.partition ? request.value.partition.id : null
)
const partitionName = computed(() =>
  request.value.partition ? request.value.partition.name : 'なし'
)

const isEditMode = ref(false)
const editedPartition = ref<string | null>(defaultPartition.value)
const toggleEditPartition = () => {
  if (isEditMode.value) {
    editedPartition.value = defaultPartition.value
  }
  isEditMode.value = !isEditMode.value
}

const handleUpdatePartition = async () => {
  try {
    await editRequestUsecase(request.value.id, {
      ...request.value,
      partition: editedPartition.value ?? ''
    })
    toast.success('更新しました')
  } catch {
    toast.error('更新に失敗しました')
  }
  isEditMode.value = false
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-bold">パーティション</h2>
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditPartition" />
    </div>
    <div>
      <span v-if="!isEditMode">{{ partitionName }}</span>
      <SearchSelect
        v-else
        v-model="editedPartition"
        label="パーティション"
        :options="partitionOptions"
        @close="handleUpdatePartition" />
    </div>
  </div>
</template>
