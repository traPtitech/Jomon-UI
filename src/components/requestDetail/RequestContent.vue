<script lang="ts" setup>
import Button from '/@/components/shared/Button.vue'
import EditButton from '/@/components/shared/EditButton.vue'
import MarkdownIt from '/@/components/shared/MarkdownIt.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

const requestDetailStore = useRequestDetailStore()
const userStore = useUserStore()
</script>

<template>
  <div class="flex">
    詳細：
    <div
      v-if="!(requestDetailStore.editMode === 'content')"
      class="flex items-start">
      <MarkdownIt
        class="pl-2 h-32 w-200 border border-gray-300 overflow-y-scroll"
        :text="requestDetailStore.request.content" />
      <EditButton
        v-if="requestDetailStore.request.created_by === userStore.me.name"
        @click="requestDetailStore.changeEditMode('content')" />
    </div>
    <div v-if="requestDetailStore.editMode === 'content'">
      <textarea
        v-model="requestDetailStore.editedValue.content"
        class="resize-none w-200 h-30 p-1"
        placeholder="詳細" />
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
