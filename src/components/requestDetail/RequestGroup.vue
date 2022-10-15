<script lang="ts" setup>
import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'

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

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)

const handleComplete = () => {
  emit('changeEditMode', '')
}
</script>

<template>
  <div class="flex items-center">
    グループ：
    <div v-if="!props.isEditMode && requestDetailStore.request">
      <span v-if="!requestDetailStore.request.group">なし</span>
      <span v-else>{{ requestDetailStore.request.group.name }}</span>
      <EditButton
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'group')" />
    </div>
    <div v-else class="flex">
      <VueSelect
        v-model="requestDetailStore.editedValue.group"
        class="w-52"
        label="name"
        :options="groupStore.groups"
        placeholder="グループ"
        :reduce="(group:any)=>group.id" />
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
