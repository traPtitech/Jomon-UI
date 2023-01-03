<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import NewRequestFileForm from '/@/components/newRequest/NewRequestFileForm.vue'
import NewRequestTag from '/@/components/newRequest/NewRequestTag.vue'
import NewRequestTargets from '/@/components/newRequest/NewRequestTargets.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputText from '/@/components/shared/InputText.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { requestTemplates } from '/@/consts/consts'

import { useNewRequest } from './composables/useNewRequest'

const tagStore = useTagStore()
const userStore = useUserStore()
const groupStore = useGroupStore()
const { isTagFetched } = storeToRefs(tagStore)
const { isGroupFetched, groupOptions } = storeToRefs(groupStore)
const { isUserFetched, me } = storeToRefs(userStore)
const { fetchTags } = tagStore
const { fetchGroups } = groupStore
const { fetchUsers } = userStore

const { request, files, postRequest } = useNewRequest()

if (!isTagFetched.value) {
  fetchTags()
}
if (!isGroupFetched.value) {
  fetchGroups()
}
if (!isUserFetched.value) {
  fetchUsers()
}
</script>

<template>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <div class="pb-8">
      <h1 class="text-center text-3xl">申請の新規作成</h1>
    </div>
    <form class="flex flex-col gap-2">
      <div class="flex flex-col">
        申請者
        <span class="text-xl">{{ me?.name }}</span>
      </div>
      <div class="flex flex-col">
        <label>タイトル</label>
        <InputText
          v-model="request.title"
          auto-focus
          class="h-8"
          placeholder="タイトルを入力" />
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <MarkdownTextarea
          v-model="request.content"
          placeholder=""
          :templates="requestTemplates" />
      </div>
      <NewRequestTargets
        :targets="request.targets"
        @input="request.targets = $event" />
      <div class="flex flex-col">
        <label>グループ</label>
        <InputSelectSingle
          v-model="request.group"
          class="!w-2/3"
          :options="groupOptions"
          placeholder="グループを選択" />
      </div>
      <NewRequestTag :tags="request.tags" @input="request.tags = $event" />
      <NewRequestFileForm :files="files" @input="files = $event" />
      <div class="text-right">
        <SimpleButton
          class="mb-4"
          font-size="xl"
          padding="md"
          @click.stop="postRequest">
          申請を作成する
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
