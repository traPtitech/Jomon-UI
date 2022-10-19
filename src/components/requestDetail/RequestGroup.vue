<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import InputSelect from '/@/components/shared/InputSelect.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { EditMode } from '/@/pages/composables/useRequestDetail'

interface Props {
  isEditMode: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const groupStore = useGroupStore()
const requestDetailStore = useRequestDetailStore()

const { request, editedValue } = storeToRefs(requestDetailStore)

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)

const handleComplete = () => {
  emit('changeEditMode', '')
}
</script>

<template>
  <div class="flex items-center">
    グループ：
    <div v-if="!props.isEditMode && request">
      <span v-if="!request.group">なし</span>
      <span v-else>{{ request.group.name }}</span>
      <EditButton
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'group')" />
    </div>
    <div v-else class="flex">
      <InputSelect
        v-model="editedValue.group"
        class="w-52"
        :options="groupStore.groupOptions"
        placeholder="グループ" />
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
