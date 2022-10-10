<script lang="ts" setup>
import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import type { EditMode } from '/@/components/groupDetail/composables/useGroupInformation'
import FixButton from '/@/components/shared/FixButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import FormInputNumber from '/@/shared/FormInputNumber.vue'

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
  <div v-if="!isEditMode" class="flex items-center pb-2">
    予算：{{ groupDetailStore.group.budget }}円
    <FixButton
      v-if="hasAuthority"
      class="ml-1"
      @click="emit('changeEditMode', 'budget')" />
  </div>
  <div v-else class="flex items-center">
    予算：
    <FormInputNumber
      v-model="groupDetailStore.editedValue.budget"
      class="mr-1 w-24"
      :min="1"
      placeholder="金額" />円
    <SimpleButton
      class="ml-2 flex items-center"
      font-size="sm"
      :is-disabled="props.isSending"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
  </div>
</template>
