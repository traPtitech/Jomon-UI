<script lang="ts" setup>
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import { useToast } from 'vue-toastification'
import EditButton from '/@/components/shared/EditButton.vue'
import SearchSelectTag from '/@/components/shared/SearchSelectTag.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import { useRequest } from '/@/features/request/composables'
import type { RequestDetail } from '/@/features/request/model'
import { editRequestUsecase } from '/@/features/request/usecase'

const request = defineModel<RequestDetail>({ required: true })

const { me } = useUserStore()
const { isRequestCreator } = useRequest(request.value)
const toast = useToast()

const hasAuthority = isRequestCreator.value(me.value)

const isEditMode = ref(false)
const toggleEditTags = () => {
  isEditMode.value = !isEditMode.value
}
const handleUpdateTags = async () => {
  try {
    await editRequestUsecase(request.value.id, {
      ...request.value,
      group: request.value.group?.id ?? null // TODO: 関係ないときでも書かないといけないので、デフォルトの値をどこかに置いておく
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
      <h2 class="text-sm font-bold">タグ</h2>
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditTags" />
    </div>
    <div>
      <div v-if="!isEditMode">
        <TagsGroup v-if="request.tags" :tags="request.tags" />
        <span v-else>なし</span>
      </div>
      <SearchSelectTag
        v-else
        v-model="request.tags"
        @close="handleUpdateTags" />
    </div>
  </div>
</template>
