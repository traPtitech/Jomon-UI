<script lang="ts" setup>
import { ref } from 'vue'

import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { RequestDetail } from '/@/lib/apis'
import { isCreater } from '/@/lib/authorityCheck'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

interface Props {
  request: RequestDetail
  isEditMode: boolean
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'changeEditMode', value: EditMode): void
}>()

const userStore = useUserStore()
const groupStore = useGroupStore()

const hasAuthority = isCreater(userStore.me, props.request.created_by)
const currentGroup = ref(props.request.group)

const handleComplete = () => {
  emit('input', currentGroup.value.id)
  emit('changeEditMode', '')
}
</script>

<template>
  <div class="items-center md:flex">
    <div v-if="!isEditMode">
      グループ：
      <span v-if="!props.request.group">なし</span>
      <span v-else>{{ props.request.group.name }}</span>
      <edit-button
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'group')" />
    </div>
    <div v-else class="flex">
      グループ：
      <vue-select
        v-model="currentGroup"
        label="name"
        :options="groupStore.groups"
        placeholder="グループ" />
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="handleComplete">
        完了
      </simple-button>
    </div>
  </div>
</template>
