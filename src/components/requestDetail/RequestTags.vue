<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import type { Tag } from '/@/features/tag/model'
import { editRequestUsecase } from '/@/features/request/usecase'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { isRequestCreator } = requestDetailStore
const { request } = storeToRefs(requestDetailStore)
const { me } = storeToRefs(userStore)

const hasAuthority = isRequestCreator(me.value)

const defaultTags = computed(() =>
  request.value?.tags ? request.value.tags : []
)

const isEditMode = ref(false)
const editedTags = ref<Tag[]>(defaultTags.value)
const toggleEditTags = () => {
  if (isEditMode.value) {
    editedTags.value = defaultTags.value
  }
  isEditMode.value = !isEditMode.value
}
const handleUpdateTags = async () => {
  if (!request.value) return
  await editRequestUsecase(request.value.id, {
    ...request.value,
    group: request.value.group?.id ?? null, // TODO: 関係ないときでも書かないといけないので、デフォルトの値をどこかに置いておく
    tags: editedTags.value
  })
  isEditMode.value = false
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <div class="text-sm font-bold">タグ</div>
      <EditButton
        v-if="hasAuthority"
        :is-edit-mode="isEditMode"
        @click="toggleEditTags" />
    </div>
    <div>
      <div v-if="!isEditMode">
        <TagsGroup v-if="request?.tags" :tags="request.tags" />
        <span v-else>なし</span>
      </div>
      <div v-else>
        <InputSelectTagWithCreation
          v-model="editedTags"
          @close="handleUpdateTags" />
      </div>
    </div>
  </div>
</template>
