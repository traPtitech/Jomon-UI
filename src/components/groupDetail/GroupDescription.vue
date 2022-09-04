<script lang="ts" setup>
import type { EditMode } from './GroupDetail.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'
import { useUserStore } from '/@/stores/user'

interface Props {
  group: GroupDetailType
  isEditMode: boolean
  value: string
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
      <simple-button
        v-if="hasAuthority"
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click="emit('changeEditMode', 'description')">
        編集
      </simple-button>
    </div>
  </div>
  <div v-else class="flex w-full">
    <textarea
      class="block h-32 w-4/5 resize-none p-1"
      placeholder="詳細"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLTextAreaElement).value)" />
    <div class="flex items-end">
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="emit('changeEditMode', '')">
        完了
      </simple-button>
    </div>
  </div>
</template>
