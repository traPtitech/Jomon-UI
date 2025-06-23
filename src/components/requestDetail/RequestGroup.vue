<script lang="ts" setup>
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import { computed, ref } from 'vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import { usePartitonStore } from '/@/stores/partiton'
import { editRequestUsecase } from '/@/features/request/usecase'
import type { ApplicationDetail } from '/@/features/request/model'
import { useRequest } from '/@/features/request/composables'
import { useToast } from 'vue-toastification'

const request = defineModel<ApplicationDetail>('modelValue', { required: true })

const { me } = useUserStore()
const { partitonOptions } = usePartitonStore()
const { isRequestCreator } = useRequest(request.value)
const toast = useToast()

const hasAuthority = isRequestCreator.value(me.value)

const defaultPartiton = computed(() =>
  request.value.partition ? request.value.partition.id : null
)
const partitonName = computed(() =>
  request.value.partition ? request.value.partition.name : 'なし'
)

const isEditMode = ref(false)
const editedPartiton = ref<string | null>(defaultPartiton.value)
const toggleEditPartiton = () => {
  if (isEditMode.value) {
    editedPartiton.value = defaultPartiton.value
  }
  isEditMode.value = !isEditMode.value
}

const handleUpdatePartiton = async () => {
  try {
    await editRequestUsecase(request.value.id, {
      ...request.value,
      partition: editedPartiton.value ?? ''
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
        @click="toggleEditPartiton" />
    </div>
    <div>
      <span v-if="!isEditMode">{{ partitonName }}</span>
      <SearchSelect
        v-else
        v-model="editedPartiton"
        label="パーティション"
        :options="partitonOptions"
        @close="handleUpdatePartiton" />
    </div>
  </div>
</template>
