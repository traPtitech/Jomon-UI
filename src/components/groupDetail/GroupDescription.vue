<script lang="ts" setup>
import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import FormTextarea from '/@/components/shared/FormTextarea.vue'
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

const hasAuthority = userStore.isAdminOrGroupOwner(
  userStore.me,
  groupDetailStore.group.owners
)
</script>

<template>
  <div>
    <p>詳細</p>
    <div v-if="!isEditMode" class="flex w-full">
      <p class="h-32 w-4/5 rounded border border-gray-300 pl-1">
        {{ groupDetailStore.group.description }}
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
      <FormTextarea
        v-model="groupDetailStore.editedValue.description"
        class="w-4/5"
        placeholder="詳細" />
      <div class="flex items-end">
        <SimpleButton
          class="ml-2 flex items-center"
          font-size="sm"
          :is-disabled="props.isSending"
          padding="sm"
          @click.stop="emit('changeEditMode', '')">
          完了
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
