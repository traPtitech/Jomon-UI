<script lang="ts" setup>
import Button from '/@/components/shared/Button.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
</script>

<template>
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
      class="w-100 rounded p-1"
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
</template>
