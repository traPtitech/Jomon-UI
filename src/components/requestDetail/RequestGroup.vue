<script lang="ts" setup>
import Button from '/@/components/shared/Button.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
</script>

<template>
  <div class="flex">
    グループ：
    <div v-if="!requestDetailStore.request.group">なし</div>
    <div v-else-if="!(requestDetailStore.editMode === 'group')">
      {{ requestDetailStore.request.group.name }}
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
  </div>
</template>
