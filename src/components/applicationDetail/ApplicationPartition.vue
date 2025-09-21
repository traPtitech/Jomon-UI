<script lang="ts" setup>
import EditButton from '@/components/shared/EditButton.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import { useApplication } from '@/features/application/composables'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import { usePartitionStore } from '@/features/partition/store'
import { useUserStore } from '@/features/user/store'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const application = defineModel<ApplicationDetail>('modelValue', {
  required: true
})

const { me } = useUserStore()
const { partitionOptions } = usePartitionStore()
const { isApplicationCreator } = useApplication(application.value)
const { editApplication } = useApplicationStore()
const toast = useToast()

const hasAuthority = isApplicationCreator.value(me.value)

const isEditMode = ref(false)
const editedPartition = ref<string | null>(application.value.partition.id)
const toggleEditPartition = () => {
  if (isEditMode.value) {
    editedPartition.value = application.value.partition.id
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
      <span v-if="!isEditMode">{{ application.partition.name }}</span>
      <SearchSelect
        v-else
        v-model="editedPartition"
        label="パーティション"
        :options="partitionOptions"
        @close="handleUpdatePartition" />
    </div>
  </div>
</template>
