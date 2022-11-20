<script lang="ts" setup>
import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import NewRequestFileForm from '/@/components/newRequest/NewRequestFileForm.vue'
import NewRequestTag from '/@/components/newRequest/NewRequestTag.vue'
import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelect from '/@/components/shared/InputSelect.vue'
import InputText from '/@/components/shared/InputText.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { requestTemplates } from '/@/consts/consts'

import { useNewRequest } from './composables/useNewRequest'

const tagStore = useTagStore()
const userStore = useUserStore()
const groupStore = useGroupStore()

const { request, files, postRequest } = useNewRequest()

if (!tagStore.isTagFetched) {
  tagStore.fetchTags()
}
if (!groupStore.isGroupFetched) {
  groupStore.fetchGroups()
}
if (!userStore.isUserFetched) {
  userStore.fetchUsers()
}
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
        <InputText
          v-model="request.title"
          class="h-8"
          placeholder="タイトルを入力" />
      </div>
      <div class="flex flex-col">
        <label>金額</label>
        <div><InputNumber v-model="request.amount" class="mr-1 h-8" />円</div>
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <MarkdownTextarea
          v-model="request.content"
          placeholder=""
          :templates="requestTemplates" />
      </div>
      <div class="flex flex-col">
        <label>払い戻し対象者</label>
        <InputSelect
          v-model="request.targets"
          class="!w-2/3"
          is-multiple
          :options="userStore.userOptions"
          placeholder="払い戻し対象者を選択" />
      </div>
      <div class="flex flex-col">
        <label>グループ</label>
        <InputSelect
          v-model="request.group"
          class="!w-2/3"
          :options="groupStore.groupOptions"
          placeholder="グループを選択" />
      </div>
      <NewRequestTag :request="request" @input="request.tags = $event" />
      <NewRequestFileForm :files="files" @input="files = $event" />
      <div class="text-right">
        <SimpleButton
          class="mb-4"
          font-size="xl"
          kind="success"
          padding="md"
          @click.stop="postRequest">
          申請を作成する
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
