<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import Button from '/@/components/shared/Button.vue'
import type { Group } from '/@/lib/apis'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

const userStore = useUserStore()
const groupStore = useGroupStore()
const { users } = storeToRefs(userStore)

const group = ref({
  name: '',
  description: '',
  budget: 0,
  owners: [] as string[],
  members: [] as string[]
})

async function postGroupAPI() {
  const willPostGroup = {
    name: group.value.name,
    description: group.value.description,
    budget: group.value.budget
  }
  const res: Group = await groupStore.postGroup(willPostGroup)
  group.value.owners.forEach(id => {
    groupStore.postGroupOwner(res.id!, id)
  })
  group.value.members.forEach(id => {
    groupStore.postGroupMember(res.id!, id)
  })
  groupStore.fetchGroups()
}
function postRequest() {
  alert('ここでgroupの送信。ownersとmembersは別にしてPOSTする')
  if (/^[1-9][0-9]*$|^0$/.test(group.value.budget.toString())) {
    postGroupAPI()
  }
}
</script>

<template>
  <h1 class="text-3xl text-center mt-4 mb-4">グループの新規作成</h1>
  <div class="flex flex-col justify-between ml-12 mr-12 text-xl h-4/5">
    <div>
      <span>グループ名：</span>
      <input v-model="group.name" class="border border-gray-300 w-4/5" />
    </div>
    <div>
      <span>詳細：</span>
      <textarea
        v-model="group.description"
        class="border border-gray-300 resize-none w-4/5" />
    </div>
    <div>
      <span>予算：</span>
      <input v-model="group.budget" class="border border-gray-300" />
    </div>
    <div>
      <span>管理者：</span>
      <v-select
        v-model="group.owners"
        class="w-2/3"
        :close-on-select="false"
        label="name"
        multiple
        :options="users"
        placeholder="管理者"
        :reduce="(user:any) => user.name"></v-select>
      注意：管理者は自動でメンバーには入りません。
    </div>
    <div>
      <span>メンバー：</span>
      <v-select
        v-model="group.members"
        class="w-2/3"
        :close-on-select="false"
        label="name"
        multiple
        :options="users"
        placeholder="メンバー"
        :reduce="(user:any) => user.name"></v-select>
    </div>
    <div class="text-center">
      <Button
        class="w-48 mb-4"
        font-size="xl"
        padding="sm"
        @clock.stop="postRequest">
        グループを作成する
      </Button>
    </div>
  </div>
</template>
