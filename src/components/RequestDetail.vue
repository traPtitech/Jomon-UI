<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import NewTagModal from './NewTagModal.vue'
import Button from './shared/Button.vue'
import FixButton from './shared/FixButton.vue'
import MarkdownIt from './shared/MarkdownIt.vue'
import StatusChip from './shared/StatusChip.vue'
import Tags from './shared/Tags.vue'
import VueSelect from './shared/VueSelect.vue'
import type { StatusEnum } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { useGeneralStore } from '/@/stores/general'
import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'
import { formatDate } from '/@/utils/date'

const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const generalStore = useGeneralStore()
const { isModalOpen2 } = storeToRefs(generalStore)
const isFixMode = ref('')

const fixedValue = ref(requestDetailStore.putRequestRequest)

async function putStatus(id: string, status: StatusEnum) {
  const statusRequest = {
    status: status,
    comment: ''
  }
  await apis.putStatus(id, statusRequest)
  requestDetailStore.fetchRequestDetail(id)
}
function changeStatus(status: StatusEnum) {
  putStatus(requestDetailStore.request.id, status)
  requestDetailStore.fetchRequestDetail(requestDetailStore.request.id)
  alert('ステータスを' + status + 'に変更しました')
} //確認ダイアログほしい
function changeIsFixMode(kind: string) {
  if (kind !== 'tags' && isFixMode.value !== kind) {
    const result = confirm(
      '入出金記録に紐づいている申請のこの情報を変更すると、入出金記録の情報にも変更が反映されます。よろしいですか？'
    )
    if (!result) return
  }
  switch (kind) {
    case 'title':
      if (isFixMode.value === 'title') {
        requestDetailStore.putRequest(requestDetailStore.request.id, {
          ...requestDetailStore.putRequestRequest,
          title: fixedValue.value.title
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'title'
      }
      break
    case 'amount':
      if (isFixMode.value === 'amount') {
        //todo:バリデーション
        requestDetailStore.putRequest(requestDetailStore.request.id, {
          ...requestDetailStore.putRequestRequest,
          amount: fixedValue.value.amount
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'amount'
      }
      break
    case 'content':
      if (isFixMode.value === 'content') {
        requestDetailStore.putRequest(requestDetailStore.request.id, {
          ...requestDetailStore.putRequestRequest,
          content: fixedValue.value.content
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'content'
      }
      break
    case 'targets':
      if (isFixMode.value === 'targets') {
        requestDetailStore.putRequest(requestDetailStore.request.id, {
          ...requestDetailStore.putRequestRequest,
          targets: fixedValue.value.targets
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'targets'
      }
      break
    case 'group':
      if (isFixMode.value === 'group') {
        requestDetailStore.putRequest(requestDetailStore.request.id, {
          ...requestDetailStore.putRequestRequest,
          group: fixedValue.value.group
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'group'
      }
      break
    case 'tags':
      if (isFixMode.value === 'tags') {
        requestDetailStore.putRequest(requestDetailStore.request.id, {
          ...requestDetailStore.putRequestRequest,
          tags: fixedValue.value.tags
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'tags'
      }
      break
  }
}
function handleModalIsOpen() {
  isModalOpen2.value = !isModalOpen2.value
}
</script>

<template>
  <NewTagModal v-if="isModalOpen2" />
  <div class="ml-12 pt-6">
    <div class="flex justify-between">
      <div class="flex items-center">
        <div v-if="!(isFixMode === 'title')" class="flex">
          <h1 class="text-3xl">
            {{ requestDetailStore.request.title }}
          </h1>
          <FixButton
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('title')">
          </FixButton>
        </div>
        <div v-if="isFixMode === 'title'">
          <input
            v-model="fixedValue.title"
            class="w-100 p-1 rounded"
            placeholder="タイトル"
            type="text" />
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeIsFixMode('title')">
            完了
          </Button>
        </div>
        <StatusChip has-text :status="requestDetailStore.request.status" />
        <div>
          <Button
            v-if="
              requestDetailStore.request.status === 'fix_required' ||
              (userStore.me.admin &&
                requestDetailStore.request.status === 'accepted')
            "
            class="mr-4"
            font-size="sm"
            padding="sm"
            @click.stop="changeStatus('submitted')">
            承認待ちにする
          </Button>
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            class="mr-4"
            font-size="sm"
            padding="sm"
            @click.stop="changeStatus('fix_required')">
            要修正にする
          </Button>
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            class="mr-4"
            font-size="sm"
            padding="sm"
            @click.stop="changeStatus('accepted')">
            承認済みにする
          </Button>
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            class="mr-4"
            font-size="sm"
            padding="sm"
            @click.stop="changeStatus('rejected')">
            却下する
          </Button>
        </div>
      </div>
      <div class="flex items-center">
        <span v-if="!requestDetailStore.request.group">グループ：なし</span>
        <div v-else-if="!(isFixMode === 'group')" class="ml-12 inline-block">
          <span>グループ：{{ requestDetailStore.request.group.name }}</span>
          <FixButton
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('group')">
          </FixButton>
        </div>
        <div v-else-if="isFixMode === 'group'" class="ml-12 inline-block">
          <VueSelect
            v-model="fixedValue.group"
            class="w-60 inline-block"
            label="name"
            :options="groupStore.groups"
            placeholder="グループ"
            :reduce="(group:any) => group.id" />
          <Button
            class="ml-2 mr-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeIsFixMode('group')">
            完了
          </Button>
        </div>
        <span class="mr-4">
          申請者：{{ requestDetailStore.request.created_by }}
        </span>
        <span class="mr-4">
          申請日：{{
            formatDate(new Date(requestDetailStore.request.created_at))
          }}
        </span>
        <div v-if="!(isFixMode === 'amount')" class="inline-block">
          <span class="text-2xl">
            金額：{{ requestDetailStore.request.amount }}円
          </span>
          <FixButton
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('amount')">
          </FixButton>
        </div>
        <div v-if="isFixMode === 'amount'" class="inline-block">
          金額：
          <input
            v-model="fixedValue.amount"
            class="w-30 p-1"
            placeholder="金額"
            type="text" />円
          <Button
            class="ml-2 mr-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeIsFixMode('amount')">
            完了
          </Button>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <span v-if="!requestDetailStore.request.tags">タグ：なし</span>
      <div v-else-if="!(isFixMode === 'tags')">
        <span>タグ：</span>
        <Tags :tags="requestDetailStore.request.tags" />
        <FixButton
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="changeIsFixMode('tags')">
        </FixButton>
      </div>
      <div v-else-if="isFixMode === 'tags'" class="inline-block">
        <span>タグ：</span>
        <VueSelect
          v-model="fixedValue.tags"
          class="w-200 inline-block"
          :close-on-select="false"
          label="name"
          multiple
          :options="tagStore.tags"
          placeholder="タグ" />
        <Button
          class="ml-2 mr-2"
          font-size="sm"
          padding="md"
          @click.stop="handleModalIsOpen">
          タグを新規作成
        </Button>
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="changeIsFixMode('tags')">
          完了
        </Button>
      </div>
    </div>
    <div class="mt-4 flex">
      <span>詳細：</span>
      <div v-if="!(isFixMode === 'content')" class="flex items-start">
        <div class="h-32 w-200 border border-gray-300 overflow-y-scroll">
          <MarkdownIt class="pl-2" :text="requestDetailStore.request.content" />
        </div>
        <FixButton
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="changeIsFixMode('content')">
        </FixButton>
      </div>
      <div v-if="isFixMode === 'content'">
        <textarea
          v-model="fixedValue.content"
          class="resize-none w-200 h-30 p-1"
          placeholder="詳細"
          type="text" />
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="changeIsFixMode('content')">
          完了
        </Button>
      </div>
      <div class="ml-30">
        <span>払い戻し対象者：</span>
        <div v-if="!(isFixMode === 'targets')" class="inline-block">
          <span
            v-for="target in requestDetailStore.request.targets"
            :key="target.id"
            class="">
            {{ target.target }}
          </span>
          <FixButton
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            @click="changeIsFixMode('targets')">
          </FixButton>
        </div>
        <div v-if="isFixMode === 'targets'" class="inline-block">
          <VueSelect
            v-model="fixedValue.targets"
            class="w-100 inline-block"
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
            @click.stop="changeIsFixMode('targets')">
            完了
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
