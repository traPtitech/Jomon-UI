<script lang="ts" setup>
import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  group: GroupDetail
  isEditMode: boolean
  value: string
  isSending: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()

const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)
</script>

<template>
  <p>詳細</p>
  <div v-if="!isEditMode" class="flex w-full">
    <p class="h-32 w-4/5 border border-gray-300 pl-1">
      {{ props.group.description }}
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
    <textarea
      class="min-h-32 w-4/5 p-1"
      placeholder="詳細"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLTextAreaElement).value)" />
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
</template>
