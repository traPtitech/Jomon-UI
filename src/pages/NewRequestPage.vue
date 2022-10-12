<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import NewRequestFileForm from '/@/components/newRequest/NewRequestFileForm.vue'
import NewRequestSubmitButton from '/@/components/newRequest/NewRequestSubmitButton.vue'
import NewRequestTag from '/@/components/newRequest/NewRequestTag.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { requestTemplates } from '/@/consts/consts'

export interface FileRequest {
  name: string
  src: string
  type: string
}
export interface RequestRequest {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: string[]
  group: string
}

const tagStore = useTagStore()
const userStore = useUserStore()
const groupStore = useGroupStore()

const request = ref<RequestRequest>({
  created_by: userStore.me?.name ?? '',
  amount: 0,
  title: '',
  targets: [],
  content: '',
  tags: [],
  group: ''
})
const files = ref<FileRequest[]>([])

function removeFile(file: FileRequest) {
  files.value = files.value.filter(f => f !== file)
}

onMounted(() => {
  if (!tagStore.isTagFetched) {
    tagStore.fetchTags()
  }
  if (!groupStore.isGroupFetched) {
    groupStore.fetchGroups()
  }
  if (!userStore.isUserFetched) {
    userStore.fetchUsers()
  }
})
</script>

<template>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <div class="pb-8">
      <h1 class="text-center text-3xl">申請の新規作成</h1>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        申請者
        <span class="text-xl">{{ userStore.me?.name }}</span>
      </div>
      <div class="flex flex-col">
        <label>タイトル</label>
        <input
          v-model="request.title"
          class="h-8 rounded border border-gray-300 p-1" />
      </div>
      <div class="flex flex-col">
        <label>金額</label>
        <div>
          <input
            v-model="request.amount"
            class="h-8 rounded border border-gray-300 p-1" />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <MarkdownTextarea
          placeholder=""
          :templates="requestTemplates"
          :value="request.content"
          @input="request.content = $event" />
      </div>
      <div class="flex flex-col">
        <label>払い戻し対象者</label>
        <VueSelect
          v-model="request.targets"
          :close-on-select="false"
          label="name"
          multiple
          :options="userStore.users"
          placeholder="払い戻し対象者を選択"
          :reduce="(user:any) => user.name" />
      </div>
      <div class="flex flex-col">
        <label>グループ</label>
        <VueSelect
          v-model="request.group"
          label="name"
          :options="groupStore.groups"
          placeholder="グループを選択"
          :reduce="(group:any) => group.id" />
      </div>
      <NewRequestTag :request="request" @input="request.tags = $event" />
      <NewRequestFileForm :files="files" @input="files = $event" />
      <NewRequestSubmitButton
        :files="files"
        :request="request"
        @remove="removeFile($event)" />
    </div>
  </div>
</template>
