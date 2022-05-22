<script lang="ts" setup>
import RequestDetailTags from './RequestDetailTags.vue'
import Button from './shared/Button.vue'
import EditButton from './shared/EditButton.vue'
import MarkdownIt from './shared/MarkdownIt.vue'
import VueSelect from './shared/VueSelect.vue'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
</script>

<template>
  <RequestDetailTags />
  <div class="pt-4 flex">
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
    <div class="ml-30 flex">
      払い戻し対象者：
      <div v-if="!(requestDetailStore.editMode === 'targets')">
        <span
          v-for="target in requestDetailStore.request.targets"
          :key="target.id">
          {{ target.target }},
        </span>
        <EditButton
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="requestDetailStore.changeEditMode('targets')" />
      </div>
      <div v-if="requestDetailStore.editMode === 'targets'">
        <VueSelect
          v-model="requestDetailStore.editedValue.targets"
          class="w-100"
          :close-on-select="false"
          label="name"
          multiple
          :options="userStore.users"
          placeholder="払い戻し対象者"
          :reduce="(user:any) => user.name" />
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
