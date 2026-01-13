<script lang="ts" setup>
import { computed } from 'vue'

import EditButton from '@/components/shared/EditButton.vue'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useApplication } from '@/features/application/composables'
import { useApplicationStore } from '@/features/application/store'
import { usePartitionStore } from '@/features/partition/store'
import { useUserStore } from '@/features/user/store'

import type { ApplicationEditMode } from './composables/useApplicationInformation'

defineProps<{
  isEditMode: boolean
  isSending: boolean
}>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: ApplicationEditMode): void
  (e: 'finishEditing'): void
}>()

const { currentApplication: application, editedValue } = useApplicationStore()

const { me } = useUserStore()
const { partitionOptions } = usePartitionStore()

const hasAuthority = computed(() => {
  if (!application.value) return false
  return useApplication(application.value).isApplicationCreator.value(me.value)
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-bold">パーティション</h2>
      <div class="flex items-center gap-2">
        <SimpleButton
          v-if="isEditMode"
          font-size="base"
          padding="sm"
          :disabled="isSending"
          @click="emit('finishEditing')">
          完了
        </SimpleButton>
        <EditButton
          v-if="hasAuthority"
          :is-edit-mode="isEditMode"
          @click="
            emit(
              'changeEditMode',
              isEditMode ? '' : ('partition' as ApplicationEditMode)
            )
          " />
      </div>
    </div>
    <div>
      <span v-if="!isEditMode">{{ application?.partition.name }}</span>
      <SearchSelect
        v-else-if="application"
        v-model="editedValue.partition"
        label="パーティション"
        :options="partitionOptions"
        @close="emit('finishEditing')" />
    </div>
  </div>
</template>
