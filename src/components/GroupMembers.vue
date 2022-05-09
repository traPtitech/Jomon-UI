<script lang="ts" setup>
import { MinusSmIcon, PlusSmIcon } from '@heroicons/vue/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import UserIcon from './shared/UserIcon.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const groupStore = useGroupStore()
const { group } = storeToRefs(groupStore)
const willAddOwners = ref<string[]>([])
const willAddMembers = ref<string[]>([])

function handleDeleteOwner(id: string) {
  groupStore.deleteGroupOwner(group.value.id, [id])
}

function handleDeleteMember(id: string) {
  groupStore.deleteGroupMember(group.value.id, [id])
}

function handleAddOwner(owners: string[]) {
  if (owners.length !== 0) {
    groupStore.postGroupMember(group.value.id, owners)
  }
}

function handleAddMember(members: string[]) {
  if (members.length !== 0) {
    groupStore.postGroupOwner(group.value.id, members)
  }
}
</script>

<template>
  <div class="flex flex-col gap-8 w-1/4 py-4">
    <div
      class="relative border border-gray-400 h-1/2 flex flex-col justify-between">
      <h2 class="absolute -top-3 left-2 px-2 bg-white">グループオーナー</h2>
      <ul class="p-4 overflow-y-scroll h-full">
        <li
          v-for="owner in group.owners"
          :key="owner"
          class="flex items-center justify-between">
          <div>
            <UserIcon class="w-12 inline" :name="owner" />
            {{ owner }}
          </div>
          <button @click="handleDeleteOwner(owner)">
            <MinusSmIcon class="w-8" />
          </button>
        </li>
      </ul>
      <div class="flex p-2">
        <VueSelect
          v-model="willAddOwners"
          class="flex-grow"
          :close-on-select="false"
          label="name"
          multiple
          :options="users"
          placeholder="追加するオーナーを選択"
          :reduce="(user:any) => user.name" />
        <button @click="handleAddOwner(willAddOwners)">
          <PlusSmIcon class="w-8" />
        </button>
      </div>
    </div>
    <div
      class="relative border border-gray-400 h-1/2 flex flex-col justify-between">
      <h2 class="absolute -top-3 left-2 px-2 bg-white">グループメンバー</h2>
      <ul class="p-4 overflow-y-scroll h-full">
        <li
          v-for="member in group.members"
          :key="member"
          class="flex items-center justify-between">
          <div>
            <UserIcon class="w-12 inline" :name="member" />
            {{ member }}
          </div>
          <button @click="handleDeleteMember(member)">
            <PlusSmIcon class="w-8" />
          </button>
        </li>
      </ul>
      <div class="flex p-2">
        <VueSelect
          v-model="willAddMembers"
          class="flex-grow"
          :close-on-select="false"
          label="name"
          multiple
          :options="users"
          placeholder="追加するメンバーを選択"
          :reduce="(user:any) => user.name" />
        <button @click="handleAddMember(willAddMembers)">
          <PlusSmIcon class="w-8" />
        </button>
      </div>
    </div>
  </div>
</template>
