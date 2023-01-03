<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import InputTextarea from '/@/components/shared/InputTextarea.vue'
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
const { group, editedValue } = storeToRefs(groupDetailStore)
const { canEditGroup } = groupDetailStore
const { me } = storeToRefs(userStore)

const hasAuthority = canEditGroup(me.value)
</script>

<template>
  <div v-if="group">
    <p>詳細</p>
    <div v-if="!isEditMode" class="flex w-full">
      <p class="h-32 w-4/5 rounded border border-gray-300 pl-1">
        {{ group.description }}
      </p>
      <div class="flex items-end">
        <SimpleButton
          v-if="hasAuthority"
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click="emit('changeEditMode', 'description')">
          編集
        </SimpleButton>
      </div>
    </div>
    <div v-else class="flex w-full">
      <InputTextarea
        v-model="editedValue.description"
        auto-focus
        class="w-4/5"
        placeholder="詳細" />
      <div class="flex items-end">
        <SimpleButton
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click="emit('changeEditMode', '')">
          キャンセル
        </SimpleButton>
        <SimpleButton
          class="ml-2"
          :disabled="props.isSending"
          font-size="sm"
          padding="sm"
          type="success"
          @click="emit('finishEditing')">
          完了
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
