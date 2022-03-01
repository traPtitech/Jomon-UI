<script lang="ts" setup>
import { PencilIcon } from '@heroicons/vue/solid'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'
import { useRequestDetailStore } from '../stores/requestDetail'
import { useTagStore } from '../stores/tag'
import { useUserStore } from '../stores/user'
import NewTagModal from './NewTagModal.vue'
import StatusChip from './StatusChip.vue'

const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const requestStore = useRequestStore()
const { isModalOpen } = storeToRefs(requestStore)
const { tags } = storeToRefs(tagStore)
const { groups } = storeToRefs(groupStore)
const { me, users } = storeToRefs(userStore)
const { request, putRequestRequest } = storeToRefs(requestDetailStore)
const isFixMode = ref('')

const fixedValue = ref(putRequestRequest.value)

function changeStatus(status: string) {
  const statusRequest = {
    status: status
  }
  requestDetailStore.putStatus(request.value.id, statusRequest)
  requestDetailStore.getRequestDetail(request.value.id)
  alert('ステータスを' + status + 'に変更しました')
} //確認ダイアログほしい
function changeIsFixMode(kind: string) {
  switch (kind) {
    case 'title':
      if (isFixMode.value === 'title') {
        requestDetailStore.putRequest(request.value.id, {
          ...putRequestRequest.value,
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
        requestDetailStore.putRequest(request.value.id, {
          ...putRequestRequest.value,
          amount: fixedValue.value.amount
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'amount'
      }
      break
    case 'content':
      if (isFixMode.value === 'content') {
        requestDetailStore.putRequest(request.value.id, {
          ...putRequestRequest.value,
          content: fixedValue.value.content
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'content'
      }
      break
    case 'targets':
      if (isFixMode.value === 'targets') {
        requestDetailStore.putRequest(request.value.id, {
          ...putRequestRequest.value,
          targets: fixedValue.value.targets
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'targets'
      }
      break
    case 'group':
      if (isFixMode.value === 'group') {
        requestDetailStore.putRequest(request.value.id, {
          ...putRequestRequest.value,
          group: fixedValue.value.group
        })
        isFixMode.value = ''
      } else {
        isFixMode.value = 'group'
      }
      break
    case 'tags':
      if (isFixMode.value === 'tags') {
        requestDetailStore.putRequest(request.value.id, {
          ...putRequestRequest.value,
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
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <NewTagModal v-if="isModalOpen" />
  <div class="w-full">
    <div class="flex justify-between text-center mt-6 ml-12">
      <div class="flex">
        <div v-if="!(isFixMode === 'title')">
          <span class="text-3xl">{{ request.title }}</span
          ><button
            v-if="request.created_by === me.name"
            class="mr-2"
            @click="changeIsFixMode('title')"
          >
            <PencilIcon class="h-6 w-6" />
          </button>
        </div>
        <div v-if="isFixMode === 'title'">
          <input
            v-model="fixedValue.title"
            type="text"
            class="w-100"
            placeholder="タイトル"
          /><button
            class="border border-solid border-black ml-2 mr-2"
            @click="changeIsFixMode('title')"
          >
            完了
          </button>
        </div>
        <StatusChip :status="request.status" />
        <div class="ml-2">
          <button
            v-if="
              request.status === 'fix_required' ||
              (me.admin && request.status === 'accepted')
            "
            @click="changeStatus('submitted')"
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            承認待ちにする
          </button>
          <button
            v-if="me.admin && request.status === 'submitted'"
            @click="changeStatus('fix_required')"
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            要修正にする
          </button>
          <button
            v-if="me.admin && request.status === 'submitted'"
            @click="changeStatus('accepted')"
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            承認済みにする
          </button>
          <button
            v-if="me.admin && request.status === 'submitted'"
            @click="changeStatus('rejected')"
            class="border border-solid border-black rounded-md mr-4 mt-2"
          >
            却下する
          </button>
        </div>
      </div>
      <div>
        <div v-if="!(isFixMode === 'group')" class="ml-12 inline">
          <span>グループ：{{ request.group.name }}</span
          ><button
            v-if="request.created_by === me.name"
            class="mr-2"
            @click="changeIsFixMode('group')"
          >
            <PencilIcon class="h-6 w-6" />
          </button>
        </div>
        <div v-if="isFixMode === 'group'" class="ml-12 inline">
          <v-select
            v-model="fixedValue.group"
            :options="groups"
            :reduce="(group:any) => group.id"
            label="name"
            placeholder="グループ"
            class="w-64 inline-block"
          ></v-select>
          <button
            class="border border-solid border-black ml-2 mr-2"
            @click="changeIsFixMode('group')"
          >
            完了
          </button>
        </div>
        <span class="mr-4">申請者：{{ request.created_by }}</span>
        <span class="mr-4"
          >申請日：{{ requestDetailStore.dateFormatter(request.created_at) }}
        </span>
        <div v-if="!(isFixMode === 'amount')" class="inline">
          <span class="text-2xl">金額：{{ request.amount }}円</span
          ><button
            v-if="request.created_by === me.name"
            class="mr-2"
            @click="changeIsFixMode('amount')"
          >
            <PencilIcon class="h-6 w-6" />
          </button>
        </div>
        <div v-if="isFixMode === 'amount'" class="inline">
          金額：<input
            v-model="fixedValue.amount"
            type="text"
            class="w-30"
            placeholder="金額"
          />円<button
            class="border border-solid border-black ml-2 mr-2"
            @click="changeIsFixMode('amount')"
          >
            完了
          </button>
        </div>
      </div>
    </div>
    <div>
      <div class="mt-4">
        <div v-if="!(isFixMode === 'tags')" class="ml-12 inline">
          <span>タグ：</span>
          <span
            v-for="(tag, index) in request.tags"
            :key="tag.id"
            :class="index !== 0 ? 'ml-2' : ''"
            class="border border-solid border-black rounded"
            >{{ tag.name }}</span
          ><button
            v-if="request.created_by === me.name"
            @click="changeIsFixMode('tags')"
          >
            <PencilIcon class="h-6 w-6" />
          </button>
        </div>
        <div v-if="isFixMode === 'tags'" class="ml-12 inline">
          <v-select
            v-model="fixedValue.tags"
            :options="tags"
            label="name"
            placeholder="タグ"
            multiple
            class="w-200 inline-block"
          ></v-select>
          <button
            @click="handleModalIsOpen"
            class="border border-solid border-black ml-4"
          >
            タグを新規作成
          </button>
          <button
            class="border border-solid border-black ml-2 mr-2"
            @click="changeIsFixMode('tags')"
          >
            完了
          </button>
        </div>
      </div>
    </div>
    <div class="ml-12 mt-4 flex">
      <span>詳細：</span>
      <div
        v-if="!(isFixMode === 'content')"
        class="h-16 w-200 border border-solid border-gray-300"
      >
        <span class="ml-2">{{ request.content }}</span
        ><button
          v-if="request.created_by === me.name"
          @click="changeIsFixMode('content')"
        >
          <PencilIcon class="h-6 w-6" />
        </button>
      </div>
      <div v-if="isFixMode === 'content'">
        <textarea
          v-model="fixedValue.content"
          type="text"
          class="resize-none w-200"
          placeholder="タイトル"
        /><button
          class="border border-solid border-black ml-2 mr-2"
          @click="changeIsFixMode('content')"
        >
          完了
        </button>
      </div>
      <div class="ml-30">
        <span>払い戻し対象者：</span>
        <div v-if="!(isFixMode === 'targets')" class="inline">
          <span v-for="target in request.targets" :key="target.id" class="">{{
            target.target
          }}</span
          ><button
            v-if="request.created_by === me.name"
            @click="changeIsFixMode('targets')"
          >
            <PencilIcon class="h-6 w-6" />
          </button>
        </div>
        <div v-if="isFixMode === 'targets'" class="inline-block">
          <v-select
            v-model="fixedValue.targets"
            :options="users"
            :reduce="(user:any) => user.name"
            label="name"
            placeholder="払い戻し対象者"
            multiple
            class="w-100 inline-block"
          ></v-select>
          <button
            class="border border-solid border-black ml-2 mr-2"
            @click="changeIsFixMode('targets')"
          >
            完了
          </button>
        </div>
      </div>
    </div>
    <div
      class="w-19/20 border border-solid border-gray-200 bg-gray-200 mr-auto ml-auto mt-4"
    ></div>
  </div>
</template>
