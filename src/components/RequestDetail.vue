<script lang="ts" setup>
import { openModal } from 'jenesius-vue-modal'
import { ref } from 'vue'

import NewTagModal from './modal/NewTagModal.vue'
import StatusChangeModal from './modal/StatusChangeModal.vue'
import Button from './shared/Button.vue'
import FixButton from './shared/FixButton.vue'
import MarkdownIt from './shared/MarkdownIt.vue'
import StatusChip from './shared/StatusChip.vue'
import Tags from './shared/Tags.vue'
import VueSelect from './shared/VueSelect.vue'
import { useGroupStore } from '/@/stores/group'
import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'
import { formatDate } from '/@/utils/date'

const tagStore = useTagStore()
const groupStore = useGroupStore()
const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const fixMode = ref('')

const fixedValue = ref({
  created_by: requestDetailStore.request.created_by,
  amount: requestDetailStore.request.amount,
  title: requestDetailStore.request.title,
  content: requestDetailStore.request.content,
  targets: requestDetailStore.targetIds,
  tags: requestDetailStore.tagIds,
  group: requestDetailStore.request.group.id
})

function changeFixMode(
  kind: 'title' | 'content' | 'amount' | 'group' | 'tags' | 'targets' | ''
) {
  if (
    fixMode.value === 'amount' &&
    kind === '' &&
    !/^[1-9][0-9]*$|^0$/.test(fixedValue.value.amount.toString())
  ) {
    alert('金額の形式が不正です')
    return
  }
  if (kind !== 'tags' && fixMode.value !== '' && kind === '') {
    const result = confirm(
      '入出金記録に紐づいている申請のこの情報を変更すると、入出金記録の情報にも変更が反映されます。よろしいですか？'
    )
    if (!result) return
  }
  if (kind !== '') {
    fixMode.value = kind
  } else {
    requestDetailStore.putRequest(
      requestDetailStore.request.id,
      fixedValue.value
    )
    fixMode.value = ''
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="flex items-center">
        <div v-if="!(fixMode === 'title')" class="flex">
          <h1 class="text-3xl">
            {{ requestDetailStore.request.title }}
          </h1>
          <FixButton
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            @click="changeFixMode('title')" />
        </div>
        <div v-if="fixMode === 'title'">
          <input
            v-model="fixedValue.title"
            class="w-100 p-1 rounded"
            placeholder="タイトル"
            type="text" />
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeFixMode('')">
            完了
          </Button>
        </div>
        <StatusChip has-text :status="requestDetailStore.request.status" />
        <div class="flex gap-4">
          <Button
            v-if="
              requestDetailStore.request.status === 'fix_required' ||
              (userStore.me.admin &&
                requestDetailStore.request.status === 'accepted')
            "
            font-size="sm"
            padding="sm"
            @click.stop="
              openModal(StatusChangeModal, { nextStatus: 'submitted' })
            ">
            承認待ちにする
          </Button>
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            font-size="sm"
            padding="sm"
            @click.stop="
              openModal(StatusChangeModal, { nextStatus: 'fix_required' })
            ">
            要修正にする
          </Button>
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            font-size="sm"
            padding="sm"
            @click.stop="
              openModal(StatusChangeModal, { nextStatus: 'accepted' })
            ">
            承認済みにする
          </Button>
          <Button
            v-if="
              userStore.me.admin &&
              requestDetailStore.request.status === 'submitted'
            "
            font-size="sm"
            padding="sm"
            @click.stop="
              openModal(StatusChangeModal, { nextStatus: 'rejected' })
            ">
            却下する
          </Button>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="!requestDetailStore.request.group">グループ：なし</span>
        <div v-else-if="!(fixMode === 'group')">
          グループ：{{ requestDetailStore.request.group.name }}
          <FixButton
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            @click="changeFixMode('group')" />
        </div>
        <div v-else-if="fixMode === 'group'" class="flex">
          <VueSelect
            v-model="fixedValue.group"
            class="w-52"
            label="name"
            :options="groupStore.groups"
            placeholder="グループ"
            :reduce="(group:any) => group.id" />
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeFixMode('')">
            完了
          </Button>
        </div>
        <span>申請者：{{ requestDetailStore.request.created_by }}</span>
        <span>
          申請日：{{
            formatDate(new Date(requestDetailStore.request.created_at))
          }}
        </span>
        <div v-if="!(fixMode === 'amount')" class="flex items-center">
          <span class="text-2xl">
            金額：{{ requestDetailStore.request.amount }}円
          </span>
          <FixButton
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            @click="changeFixMode('amount')" />
        </div>
        <div v-if="fixMode === 'amount'" class="flex items-center">
          金額：
          <input
            v-model="fixedValue.amount"
            class="w-24 p-1"
            placeholder="金額"
            type="text" />円
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeFixMode('')">
            完了
          </Button>
        </div>
      </div>
    </div>
    <div class="pt-4">
      <div v-if="!requestDetailStore.request.tags">タグ：なし</div>
      <div v-else-if="!(fixMode === 'tags')">
        タグ：
        <Tags :tags="requestDetailStore.request.tags" />
        <FixButton
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="changeFixMode('tags')" />
      </div>
      <div v-else-if="fixMode === 'tags'" class="flex items-center">
        タグ：
        <VueSelect
          v-model="fixedValue.tags"
          class="w-200"
          :close-on-select="false"
          label="name"
          multiple
          :options="tagStore.tags"
          placeholder="タグ" />
        <Button
          class="ml-2"
          font-size="sm"
          padding="md"
          @click.stop="openModal(NewTagModal)">
          タグを新規作成
        </Button>
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="changeFixMode('')">
          完了
        </Button>
      </div>
    </div>
    <div class="pt-4 flex">
      詳細：
      <div v-if="!(fixMode === 'content')" class="flex items-start">
        <div class="h-32 w-200 border border-gray-300 overflow-y-scroll">
          <MarkdownIt class="pl-2" :text="requestDetailStore.request.content" />
        </div>
        <FixButton
          v-if="requestDetailStore.request.created_by === userStore.me.name"
          @click="changeFixMode('content')" />
      </div>
      <div v-if="fixMode === 'content'">
        <textarea
          v-model="fixedValue.content"
          class="resize-none w-200 h-30 p-1"
          placeholder="詳細" />
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="changeFixMode('')">
          完了
        </Button>
      </div>
      <div class="ml-30 flex">
        払い戻し対象者：
        <div v-if="!(fixMode === 'targets')">
          <span
            v-for="target in requestDetailStore.request.targets"
            :key="target.id">
            {{ target.target }},
          </span>
          <FixButton
            v-if="requestDetailStore.request.created_by === userStore.me.name"
            @click="changeFixMode('targets')" />
        </div>
        <div v-if="fixMode === 'targets'">
          <VueSelect
            v-model="fixedValue.targets"
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
            @click.stop="changeFixMode('')">
            完了
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
