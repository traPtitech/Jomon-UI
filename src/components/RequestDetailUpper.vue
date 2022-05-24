<script lang="ts" setup>
import StatusChangeButtons from './StatusChangeButtons.vue'
import Button from './shared/Button.vue'
import EditButton from './shared/EditButton.vue'
import StatusChip from './shared/StatusChip.vue'
import VueSelect from './shared/VueSelect.vue'
import { formatDate } from '/@/lib/date'
import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

const groupStore = useGroupStore()
const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const formattedDate = formatDate(requestDetailStore.request.created_at)
</script>

<template>
  <div class="flex justify-between">
    <div class="flex items-center">
      <div v-if="!(requestDetailStore.editMode === 'title')" class="flex">
        <h1 class="text-3xl">
          {{ requestDetailStore.request.title }}
        </h1>
        <EditButton
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="requestDetailStore.changeEditMode('title')" />
      </div>
      <div v-if="requestDetailStore.editMode === 'title'">
        <input
          v-model="requestDetailStore.editedValue.title"
          class="w-100 p-1 rounded"
          placeholder="タイトル"
          type="text" />
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="requestDetailStore.changeEditMode('')">
          完了
        </Button>
      </div>
      <StatusChip has-text :status="requestDetailStore.request.status" />
      <StatusChangeButtons />
    </div>
    <div class="flex items-center gap-4">
      <span v-if="!requestDetailStore.request.group">グループ：なし</span>
      <div v-else-if="!(requestDetailStore.editMode === 'group')">
        グループ：{{ requestDetailStore.request.group.name }}
        <EditButton
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="requestDetailStore.changeEditMode('group')" />
      </div>
      <div v-else-if="requestDetailStore.editMode === 'group'" class="flex">
        <VueSelect
          v-model="requestDetailStore.editedValue.group"
          class="w-52"
          label="name"
          :options="groupStore.groups"
          placeholder="グループ"
          :reduce="(group:any) => group.id" />
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="requestDetailStore.changeEditMode('')">
          完了
        </Button>
      </div>
      <span>申請者：{{ requestDetailStore.request.created_by }}</span>
      <span> 申請日：{{ formattedDate }} </span>
      <div
        v-if="!(requestDetailStore.editMode === 'amount')"
        class="flex items-center">
        <span class="text-2xl">
          金額：{{ requestDetailStore.request.amount }}円
        </span>
        <EditButton
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="requestDetailStore.changeEditMode('amount')" />
      </div>
      <div
        v-if="requestDetailStore.editMode === 'amount'"
        class="flex items-center">
        金額：
        <input
          v-model="requestDetailStore.editedValue.amount"
          class="w-24 p-1"
          placeholder="金額"
          type="text" />円
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="requestDetailStore.changeEditMode('')">
          完了
        </Button>
      </div>
    </div>
  </div>
</template>
