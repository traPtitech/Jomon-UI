<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import { computed, ref } from 'vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import { useGroupStore } from '/@/stores/group'
import { editRequestUsecase } from '/@/features/request/usecase'
import type { RequestDetail } from '/@/features/request/model'
import { useRequest } from '/@/features/request/composables'
import { useToast } from 'vue-toastification'

const request = defineModel<RequestDetail>('modelValue', { required: true })

const userStore = useUserStore()
const groupStore = useGroupStore()
const { isRequestCreator } = useRequest(request.value)
const { me } = storeToRefs(userStore)
const { groupOptions } = storeToRefs(groupStore)
const toast = useToast()

const hasAuthority = isRequestCreator.value(me.value)

const defaultGroup = computed(() =>
  request.value.group ? request.value.group.id : null
)
const groupName = computed(() =>
  request.value.group ? request.value.group.name : 'なし'
)

const isEditMode = ref(false)
const editedGroup = ref<string | null>(defaultGroup.value)
const toggleEditGroup = () => {
  if (isEditMode.value) {
    editedGroup.value = defaultGroup.value
  }
  isEditMode.value = !isEditMode.value
}

const handleUpdateGroup = async () => {
  try {
    await editRequestUsecase(request.value.id, {
      ...request.value,
      group: editedGroup.value
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
      <h2 class="text-sm font-bold">グループ</h2>
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditGroup" />
    </div>
    <div>
      <span v-if="!isEditMode">{{ groupName }}</span>
      <SearchSelect
        v-else
        v-model="editedGroup"
        label="グループ"
        :options="groupOptions"
        @close="handleUpdateGroup" />
    </div>
  </div>
</template>
