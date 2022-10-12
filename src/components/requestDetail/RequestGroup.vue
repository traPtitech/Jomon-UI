<script lang="ts" setup>
import { ref } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import type { RequestDetail } from '/@/lib/apis'

import EditButton from '/@/components/shared/EditButton.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { EditMode } from '/@/pages/composables/requestDetail/useRequestDetail'

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
const requestDetailStore = useRequestDetailStore()

const hasAuthority = requestDetailStore.isRequestCreater(userStore.me)
const currentGroup = ref(props.request.group)

const handleComplete = () => {
  emit('input', currentGroup.value.id)
  emit('changeEditMode', '')
}
</script>

<template>
  <div class="flex items-center">
    グループ：
    <div v-if="!isEditMode">
      <span v-if="!props.request.group">なし</span>
      <span v-else>{{ props.request.group.name }}</span>
      <EditButton
        v-if="hasAuthority"
        class="ml-1"
        @click="emit('changeEditMode', 'group')" />
    </div>
    <div v-else class="flex">
      <!--@inputとvalueだと@inputが上手く動かなかった-->
      <VueSelect
        v-model="currentGroup"
        class="w-52"
        label="name"
        :options="groupStore.groups"
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
