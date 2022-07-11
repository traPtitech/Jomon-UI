<script lang="ts" setup>
import { ref } from 'vue'

import NewRequestImageForm from '/@/components/newRequest/NewRequestImageForm.vue'
import NewRequestSubmitButton from '/@/components/newRequest/NewRequestSubmitButton.vue'
import NewRequestTag from '/@/components/newRequest/NewRequestTag.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import clubBudgetRequestTemplate from '/@/md/clubBudgetRequest.md?raw'
import travelingExpenseRequestTemplate from '/@/md/travelingExpenseRequest.md?raw'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

interface File {
  name: string
  src: string
}
interface RequestRequest {
  created_by: string
  amount: number
  title: string
  content: string
  targets: string[]
  tags: string[]
  group: string | null
}

const userStore = useUserStore()
const groupStore = useGroupStore()

const templates = [
  { name: '部費利用申請', value: clubBudgetRequestTemplate },
  { name: '交通費申請', value: travelingExpenseRequestTemplate }
]

const request = ref<RequestRequest>({
  created_by: userStore.me.name,
  amount: 0,
  title: '',
  targets: [],
  content: '',
  tags: [],
  group: null
})
const images = ref<File[]>([])
</script>

<template>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <div class="pb-8">
      <h1 class="text-center text-3xl">申請の新規作成</h1>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        申請者
        <span class="text-xl">{{ userStore.me.name }}</span>
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
          :templates="templates"
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
      <NewRequestImageForm :images="images" @input="images = $event" />
      <NewRequestSubmitButton :images="images" :request="request" />
    </div>
  </div>
</template>
