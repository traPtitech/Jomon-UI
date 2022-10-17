<script setup lang="ts">
import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import InputText from '/@/componenets/shared/InputText.vue'
import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  isEditMode: boolean
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()

const hasAuthority = groupDetailStore.canEditGroup(userStore.me)
</script>

<template>
  <div v-if="groupDetailStore.group" class="flex items-center">
    <h1 v-if="!isEditMode" class="flex-grow text-3xl">
      {{ groupDetailStore.group.name }}
    </h1>
    <InputText
      v-else
      v-model="groupDetailStore.editedValue.name"
      class="flex-grow"
      placeholder="グループ名" />
    <SimpleButton
      v-if="hasAuthority && !isEditMode"
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click="emit('changeEditMode', 'name')">
      編集
    </SimpleButton>
    <SimpleButton
      v-else
      class="ml-2"
      font-size="sm"
      :is-disabled="props.isSending"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
  </div>
</template>
