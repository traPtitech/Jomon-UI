<script lang="ts" setup>
import SimpleButton from '../shared/SimpleButton.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'
import type{RequestDetail} from '/@/lib/apis'

interface Props{
  request: RequestDetail
}

const props=defineProps<Props>()

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
</script>

<template>
  <div class="flex">
    グループ：
    <div v-if="!props.request.group">なし</div>
    <div v-else-if="!(requestDetailStore.editMode === 'group')">
      {{ props.request.group.name }}
      <edit-button
        v-if="props.request.created_by === userStore.me!.name"
        @click="requestDetailStore.changeEditMode('group')" />
    </div>
    <div v-else-if="requestDetailStore.editMode === 'group'" class="flex">
      <vue-select
        v-model="requestDetailStore.editedValue.group"
        class="w-52"
        label="name"
        :options="groupStore.groups"
        placeholder="グループ"
        :reduce="(group:any) => group.id" />
      <simple-button
        class="ml-2"
        font-size="sm"
        padding="sm"
        @click.stop="requestDetailStore.changeEditMode('')">
        完了
      </simple-button>
    </div>
  </div>
</template>
