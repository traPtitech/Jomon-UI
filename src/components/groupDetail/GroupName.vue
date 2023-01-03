<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  isEditMode: boolean
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
  (e: 'finishEditing'): void
}>()

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()
const { canEditGroup } = groupDetailStore
const { group, editedValue } = storeToRefs(groupDetailStore)
const { me } = storeToRefs(userStore)

const hasAuthority = canEditGroup(me.value)
</script>

<template>
  <div v-if="group" class="flex items-center">
    <h1 v-if="!isEditMode" class="flex-grow text-3xl">
      {{ group.name }}
    </h1>
    <InputText
      v-else
      v-model="editedValue.name"
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
    <template v-else-if="hasAuthority && isEditMode">
      <SimpleButton
        class="ml-2"
        font-size="sm"
        :is-disabled="props.isSending"
        padding="sm"
        @click="emit('changeEditMode', '')">
        キャンセル
      </SimpleButton>
      <SimpleButton
        class="ml-2"
        font-size="sm"
        :is-disabled="props.isSending"
        padding="sm"
        type="success"
        @click="emit('finishEditing')">
        完了
      </SimpleButton>
    </template>
  </div>
</template>
