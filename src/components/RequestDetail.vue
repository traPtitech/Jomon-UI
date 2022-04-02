<script lang="ts" setup>
import { PencilIcon } from '@heroicons/vue/solid'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGeneralStore } from '../stores/general'
import { useGroupStore } from '../stores/group'
import { useRequestDetailStore } from '../stores/requestDetail'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'
import { Status } from '../types/requestTypes'
import Button from './Button.vue'
import MarkdownIt from './MarkdownIt.vue'
import NewTagModal from './NewTagModal.vue'
import StatusChip from './StatusChip.vue'
import Tags from './Tags.vue'
import VueSelect from './VueSelect.vue'

const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const generalStore = useGeneralStore()
const { isModalOpen2 } = storeToRefs(generalStore)
const isFixMode = ref('')

const fixedValue = ref(requestDetailStore.putRequestRequest)

async function putStatus(id: string, statusRequest: Status) {
  await axios.put('/api/requests/' + id + '/status', statusRequest)
  requestDetailStore.getRequestDetail(id)
}
function changeStatus(status: string) {
  const statusRequest = {
    status: status
  }
  putStatus(requestDetailStore.request.id, statusRequest)
  requestDetailStore.getRequestDetail(requestDetailStore.request.id)
  alert('ステータスを' + status + 'に変更しました')
} //確認ダイアログほしい
function changeIsFixMode(kind: string) {
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
  <div class="w-full">
    <div class="flex justify-between text-center mt-6 ml-12">
      <div class="flex">
        <div v-if="!(isFixMode === 'title')">
          <span class="text-3xl">{{ requestDetailStore.request.title }}</span
          ><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('title')"
          >
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'title'">
          <input
            v-model="fixedValue.title"
            type="text"
            class="w-100 p-1"
            placeholder="タイトル"
          />
          <Button
            @onClick="changeIsFixMode('title')"
            class="ml-2"
            text="text-sm"
            padding="sm"
            >完了</Button
          >
        </div>
        <StatusChip :status="requestDetailStore.request.status" :text="true" />
        <div class="ml-2">
          <button
            v-if="
              requestDetailStore.request.status === 'fix_required' ||
              (userStore.me.admin &&
                requestDetailStore.request.status === 'accepted')
            "
            @click="changeStatus('submitted')"
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            承認待ちにする
          </button>
          <button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            @click="changeStatus('fix_required')"
            class="border border-solid border-black rounded-md mr-4"
          >
            要修正にする
          </button>
          <button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            @click="changeStatus('accepted')"
            class="border border-solid border-black rounded-md mr-4"
          >
            承認済みにする
          </button>
          <button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            @click="changeStatus('rejected')"
            class="border border-solid border-black rounded-md mr-4"
          >
            却下する
          </button>
        </div>
      </div>
      <div>
        <div v-if="!(isFixMode === 'group')" class="ml-12 inline">
          <span>グループ：{{ requestDetailStore.request.group.name }}</span
          ><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('group')"
          >
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'group'" class="ml-12 inline">
          <VueSelect
            v-model="fixedValue.group"
            :options="groupStore.groups"
            :reduce="(group:any) => group.id"
            label="name"
            placeholder="グループ"
            class="w-60 inline-block"
          ></VueSelect>
          <Button
            @onClick="changeIsFixMode('group')"
            class="ml-2 mr-2"
            text="text-sm"
            padding="sm"
            >完了</Button
          >
        </div>
        <span class="mr-4"
          >申請者：{{ requestDetailStore.request.created_by }}</span
        >
        <span class="mr-4"
          >申請日：{{
            requestDetailStore.dateFormatter(
              requestDetailStore.request.created_at
            )
          }}
        </span>
        <div v-if="!(isFixMode === 'amount')" class="inline">
          <span class="text-2xl"
            >金額：{{ requestDetailStore.request.amount }}円</span
          ><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            class="mr-2"
            @click="changeIsFixMode('amount')"
          >
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'amount'" class="inline">
          金額：<input
            v-model="fixedValue.amount"
            type="text"
            class="w-30 p-1"
            placeholder="金額"
          />円
          <Button
            @onClick="changeIsFixMode('amount')"
            class="ml-2 mr-2"
            text="text-sm"
            padding="sm"
            >完了</Button
          >
        </div>
      </div>
    </div>
    <div>
      <div class="mt-2">
        <div v-if="!(isFixMode === 'tags')" class="ml-12 inline">
          <span>タグ：</span>
          <Tags :tags="requestDetailStore.request.tags" /><button
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            @click="changeIsFixMode('tags')"
          >
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'tags'" class="ml-12 inline">
          <span>タグ：</span>
          <VueSelect
            v-model="fixedValue.tags"
            :options="tagStore.tags"
            label="name"
            placeholder="タグ"
            multiple
            :closeOnSelect="false"
            class="w-200 inline-block"
          ></VueSelect>
          <Button
            @onClick="handleModalIsOpen"
            class="ml-2 mr-2"
            text="text-sm"
            padding="md"
          >
            タグを新規作成</Button
          >
          <Button
            @onClick="changeIsFixMode('tags')"
            class="ml-2"
            text="text-sm"
            padding="sm"
            >完了</Button
          >
        </div>
      </div>
    </div>
    <div class="ml-12 mt-4 flex">
      <span>詳細：</span>
      <div v-if="!(isFixMode === 'content')" class="flex items-start">
        <div
          class="h-32 w-200 border border-solid border-gray-300 overflow-y-scroll"
        >
          <div class="ml-2">
            <MarkdownIt :text="requestDetailStore.request.content" />
          </div>
        </div>
        <button
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="changeIsFixMode('content')"
        >
          <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
        </button>
      </div>
      <div v-if="isFixMode === 'content'">
        <textarea
          v-model="fixedValue.content"
          type="text"
          class="resize-none w-200 h-30 p-0"
          placeholder="詳細"
        />
        <Button
          @onClick="changeIsFixMode('content')"
          class="ml-2"
          text="text-sm"
          padding="sm"
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
            @click="changeIsFixMode('targets')"
          >
            <PencilIcon class="h-5 w-5 text-gray-500 opacity-50" />
          </button>
        </div>
        <div v-if="isFixMode === 'targets'" class="inline-block">
          <VueSelect
            v-model="fixedValue.targets"
            :options="userStore.users"
            :reduce="(user:any) => user.name"
            label="name"
            placeholder="払い戻し対象者"
            multiple
            :closeOnSelect="false"
            class="w-100 inline-block"
          ></VueSelect>
          <Button
            @onClick="changeIsFixMode('targets')"
            class="ml-2"
            text="text-sm"
            padding="sm"
            >完了</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>
