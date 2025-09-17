<script lang="ts" setup>
import { useUserStore } from '/@/features/user/store'

import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'
import EditButton from '/@/components/shared/EditButton.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import { useApplication } from '/@/features/application/composables'
import type { ApplicationDetail } from '/@/features/application/entities'
import { useApplicationStore } from '/@/features/application/store'
import { usePartitionStore } from '/@/features/partition/store'

const application = defineModel<ApplicationDetail>('modelValue', {
  required: true
})

const { me } = useUserStore()
const { partitionOptions } = usePartitionStore()
const { isApplicationCreator } = useApplication(application.value)
const { editApplication } = useApplicationStore()
const toast = useToast()

const hasAuthority = isApplicationCreator.value(me.value)

const defaultPartition = computed(() =>
  application.value.partition ? application.value.partition.id : null
)
const partitionName = computed(() =>
  application.value.partition ? application.value.partition.name : 'なし'
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
    await editApplication(application.value.id, {
      ...application.value,
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
