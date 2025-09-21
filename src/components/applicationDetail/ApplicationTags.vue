<script lang="ts" setup>
import EditButton from '@/components/shared/EditButton.vue'
import SearchSelectTag from '@/components/shared/SearchSelectTag.vue'
import TagsPartition from '@/components/shared/TagsPartition.vue'
import { useApplication } from '@/features/application/composables'
import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import { useUserStore } from '@/features/user/store'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const application = defineModel<ApplicationDetail>({ required: true })

const { me } = useUserStore()
const { isApplicationCreator } = useApplication(application.value)
const { editApplication } = useApplicationStore()
const toast = useToast()

const hasAuthority = isApplicationCreator.value(me.value)

const isEditMode = ref(false)
const toggleEditTags = () => {
  isEditMode.value = !isEditMode.value
}
const handleUpdateTags = async () => {
  try {
    await editApplication(application.value.id, {
      ...application.value,
      partition: application.value.partition.id
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
        <TagsPartition v-if="application.tags" :tags="application.tags" />
        <span v-else>なし</span>
      </div>
      <SearchSelectTag
        v-else
        v-model="application.tags"
        @close="handleUpdateTags" />
    </div>
  </div>
</template>
