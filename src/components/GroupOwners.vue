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

function handleAddOwner(owners: string[]) {
  if (owners.length !== 0) {
    groupStore.postGroupMember(group.value.id, owners)
  }
}
function handleDeleteOwner(id: string) {
  groupStore.deleteGroupOwner(group.value.id, [id])
}
</script>

<template>
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
</template>
