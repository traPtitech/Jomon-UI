<script lang="ts" setup>
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { useGroupStore } from '../stores/group'
import { useUserStore } from '../stores/user'
import { Group2, GroupResponse, Member } from '../types/groupTypes'

const userStore = useUserStore()
const groupStore = useGroupStore()
const { users } = storeToRefs(userStore)

const group = ref({
  name: '',
  description: '',
  budget: 0,
  owners: [] as string[],
  members: [] as string[]
} as Group2)
async function postGroupMember(id: string, member: Member) {
  await axios.post('/api/groups' + id + '/members', member)
  groupStore.getGroupMembers(id)
}
async function postGroupOwner(id: string, owner: Member) {
  await axios.post('/api/groups' + id + '/owners', owner)
  groupStore.getGroupOwners(id)
}
async function postGroupAPI(group: Group2) {
  const willPostGroup = {
    name: group.name,
    description: group.description,
    budget: group.budget
  }
  const res: GroupResponse = await axios.post('/api/groups', willPostGroup)
  for (let i = 0; i < group.owners.length; i++) {
    postGroupOwner(res.id, { id: group.owners[i] })
  }
  for (let i = 0; i < group.members.length; i++) {
    postGroupMember(res.id, { id: group.members[i] })
  }
  groupStore.getGroups()
}
function postRequest() {
  alert('ここでgroupの送信。ownersとmembersは別にしてPOSTする')
  if (/^[1-9][0-9]*$|^0$/.test(group.value.budget.toString())) {
    postGroupAPI(group.value)
  }
}
</script>

<template>
  <div
    class="bg-white w-240 h-120 absolute z-3 inset-0 m-auto border border-solid border-black"
  >
    <h1 class="text-3xl text-center mt-4 mb-4">グループの新規作成</h1>
    <div class="flex flex-col justify-between ml-12 text-xl h-4/5">
      <div>
        <span>グループ名</span>
        <input
          v-model="group.name"
          class="border border-solid border-black w-4/5"
        />
      </div>
      <div>
        <span>詳細：</span>
        <textarea
          v-model="group.description"
          class="border border-solid border-black resize-none w-4/5"
        />
      </div>
      <div>
        <span>予算：</span>
        <input
          v-model="group.budget"
          class="border border-solid border-black"
        /><!-- //ToDo:バリデーション -->
      </div>
      <div>
        <span>管理者：</span>
        <v-select
          v-model="group.owners"
          :options="users"
          :reduce="(user:any) => user.name"
          label="name"
          placeholder="管理者"
          multiple
          :closeOnSelect="false"
          class="w-2/3"
        ></v-select>
        注意：管理者は自動でメンバーには入りません。
      </div>
      <div>
        <span>メンバー：</span>
        <v-select
          v-model="group.members"
          :options="users"
          :reduce="(user:any) => user.name"
          label="name"
          placeholder="メンバー"
          multiple
          :closeOnSelect="false"
          class="w-2/3"
        ></v-select>
      </div>
      <div class="text-center">
        <button @click="postRequest" class="w-52">グループを作成する</button>
      </div>
    </div>
  </div>
</template>
