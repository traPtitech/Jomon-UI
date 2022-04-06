<script lang="ts" setup>
import { PencilIcon } from '@heroicons/vue/solid'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGeneralStore } from '../stores/general'
import { useGroupStore } from '../stores/group'
import { useRequestDetailStore } from '../stores/requestDetail'
import { useTagStore } from '../stores/tag'
import { useTransactionStore } from '../stores/transaction'
import { useUserStore } from '../stores/user'
import { Status } from '../types/requestTypes'
import { dateFormatter } from '../utiles/dateFormatter'
import NewTagModal from './NewTagModal.vue'
import Button from './shared/Button.vue'
import MarkdownIt from './shared/MarkdownIt.vue'
import StatusChip from './shared/StatusChip.vue'
import Tags from './shared/Tags.vue'
import VueSelect from './shared/VueSelect.vue'

const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const transactionStore = useTransactionStore()
const generalStore = useGeneralStore()
const { isModalOpen2 } = storeToRefs(generalStore)
const { transactions } = storeToRefs(transactionStore)
const isFixMode = ref('')

const fixedValue = ref(requestDetailStore.putRequestRequest)

async function putStatus(id: string, statusRequest: Status) {
  await axios.put('/api/requests/' + id + '/status', statusRequest)
  requestDetailStore.fetchRequestDetail(id)
}
function changeStatus(status: string) {
  const statusRequest = {
    status: status
  }
  putStatus(requestDetailStore.request.id!, statusRequest)
  requestDetailStore.fetchRequestDetail(requestDetailStore.request.id!)
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
        requestDetailStore.putRequest(requestDetailStore.request.id!, {
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
        requestDetailStore.putRequest(requestDetailStore.request.id!, {
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
        requestDetailStore.putRequest(requestDetailStore.request.id!, {
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
        requestDetailStore.putRequest(requestDetailStore.request.id!, {
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
        requestDetailStore.putRequest(requestDetailStore.request.id!, {
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
        requestDetailStore.putRequest(requestDetailStore.request.id!, {
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
  <div class="w-full">
    <div class="flex justify-between text-center pt-6 ml-12">
      <div class="flex items-center">
        <div v-if="!(isFixMode === 'title')">
          <span class="text-3xl">{{ requestDetailStore.request.title }}</span
          ><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('title')">
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'title'">
          <input
            v-model="fixedValue.title"
            class="w-100 p-1"
            placeholder="タイトル"
            type="text" />
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeIsFixMode('title')"
            >完了</Button
          >
        </div>
        <StatusChip
          :status="requestDetailStore.request.status!"
          :text="true!" />
        <div>
          <Button
            v-if="
              requestDetailStore.request.status === 'fix_required' ||
              (userStore.me.admin &&
                requestDetailStore.request.status === 'accepted')
            "
            class="mr-4 mt-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeStatus('submitted')">
            承認待ちにする</Button
          >
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            class="mr-4 mt-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeStatus('fix_required')"
            >要修正にする</Button
          >
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            class="mr-4 mt-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeStatus('accepted')"
            >承認済みにする</Button
          >
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            class="mr-4 mt-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeStatus('rejected')"
            >却下する</Button
          >
        </div>
      </div>
      <div>
        <div v-if="!(isFixMode === 'group')" class="ml-12 inline">
          <span>グループ：{{ requestDetailStore.request.group!.name }}</span
          ><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('group')">
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'group'" class="ml-12 inline">
          <VueSelect
            v-model="fixedValue.group"
            class="w-60 inline-block"
            label="name"
            :options="groupStore.groups"
            placeholder="グループ"
            :reduce="(group:any) => group.id"></VueSelect>
          <Button
            class="ml-2 mr-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeIsFixMode('group')"
            >完了</Button
          >
        </div>
        <span class="mr-4"
          >申請者：{{ requestDetailStore.request.created_by }}</span
        >
        <span class="mr-4"
          >申請日：{{ dateFormatter(requestDetailStore.request.created_at!) }}
        </span>
        <div v-if="!(isFixMode === 'amount')" class="inline">
          <span class="text-2xl"
            >金額：{{ requestDetailStore.request.amount }}円</span
          ><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('amount')">
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'amount'" class="inline">
          金額：<input
            v-model="fixedValue.amount"
            class="w-30 p-1"
            placeholder="金額"
            type="text" />円
          <Button
            class="ml-2 mr-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeIsFixMode('amount')"
            >完了</Button
          >
        </div>
      </div>
    </div>
    <div>
      <div class="mt-2">
        <div v-if="!(isFixMode === 'tags')" class="ml-12 inline">
          <span>タグ：</span>
          <Tags :tags="requestDetailStore.request.tags!" /><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            @click="changeIsFixMode('tags')">
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'tags'" class="ml-12 inline">
          <span>タグ：</span>
          <VueSelect
            v-model="fixedValue.tags"
            class="w-200 inline-block"
            :close-on-select="false"
            label="name"
            multiple
            :options="tagStore.tags"
            placeholder="タグ"></VueSelect>
          <Button
            class="ml-2 mr-2"
            font-size="sm"
            padding="md"
            @click.stop="handleModalIsOpen">
            タグを新規作成</Button
          >
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeIsFixMode('tags')"
            >完了</Button
          >
        </div>
      </div>
    </div>
    <div class="ml-12 mt-4 flex">
      <span>詳細：</span>
      <div v-if="!(isFixMode === 'content')" class="flex items-start">
        <div
          class="h-32 w-200 border border-solid border-gray-300 overflow-y-scroll">
          <div class="ml-2">
            <MarkdownIt :text="requestDetailStore.request.content!" />
          </div>
        </div>
        <button
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="changeIsFixMode('content')">
          <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
        </button>
      </div>
      <div v-if="isFixMode === 'content'">
        <textarea
          v-model="fixedValue.content"
          class="resize-none w-200 h-30 p-0"
          placeholder="詳細"
          type="text" />
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="changeIsFixMode('content')"
          >完了</Button
        >
      </div>
      <div class="ml-30">
        <span>払い戻し対象者：</span>
        <div v-if="!(isFixMode === 'targets')" class="inline">
          <span
            v-for="target in requestDetailStore.request.targets"
            :key="target.id"
            class=""
            >{{ target.target }}</span
          ><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            @click="changeIsFixMode('targets')">
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
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
            :reduce="(user:any) => user.name"></VueSelect>
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeIsFixMode('targets')"
            >完了</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>
