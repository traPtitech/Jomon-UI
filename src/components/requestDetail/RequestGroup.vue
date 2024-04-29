<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import { computed, ref } from 'vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import { useGroupStore } from '/@/stores/group'
import { editRequestUsecase } from '/@/features/request/usecase'
import type { RequestDetail } from '/@/features/request/model'

const props = defineProps<{
  request: RequestDetail
}>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const groupStore = useGroupStore()
const { isRequestCreator } = requestDetailStore
const { me } = storeToRefs(userStore)
const { groupOptions } = storeToRefs(groupStore)

const hasAuthority = isRequestCreator(me.value)

const defaultGroup = computed(() =>
  props.request.group ? props.request.group.id : null
)
const groupName = computed(() =>
  props.request.group ? props.request.group.name : 'なし'
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
  await editRequestUsecase(props.request.id, {
    ...props.request,
    group: editedGroup.value
  })
  isEditMode.value = false
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <div class="text-sm font-bold">グループ</div>
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditGroup" />
    </div>
    <div>
      <span v-if="!isEditMode">{{ groupName }}</span>
      <div v-else>
        <InputSelectSingle
          v-model="editedGroup"
          :options="groupOptions"
          @close="handleUpdateGroup" />
      </div>
    </div>
  </div>
</template>
