<script lang="ts" setup>
import { storeToRefs } from 'pinia'

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
      <VueSelect
        v-model="editedValue.group"
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
