<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { EditMode } from '/@/pages/composables/useRequestDetail'

interface Props {
  isEditMode: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()

const { request, editedValue } = storeToRefs(requestDetailStore)

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)

const handleComplete = () => {
  emit('changeEditMode', '')
}
</script>

<template>
  <div class="flex items-center">
    <div v-if="!props.isEditMode && request" class="pb-2">
      タグ：
      <span v-if="request.tags.length === 0">なし</span>
      <TagsGroup v-else :tags="request.tags" />
      <EditButton
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'tags')" />
    </div>
    <div v-else class="flex items-center">
      タグ：
      <InputSelectTagWithCreation v-model="editedValue.tags" />
      <SimpleButton
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="handleComplete">
        完了
      </SimpleButton>
    </div>
  </div>
</template>
