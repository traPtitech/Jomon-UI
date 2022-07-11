<script lang="ts" setup>
import { MinusSmIcon, PlusSmIcon } from '@heroicons/vue/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import UserIcon from './shared/UserIcon.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { Group } from '/@/lib/apis'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

type Props = { group: Group }

const props = defineProps<Props>()
const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const groupStore = useGroupStore()
const OwnersToBeAdded = ref<string[]>([])

function handleAddOwner(owners: string[]) {
  if (owners.length !== 0) {
    groupStore.postGroupMember(props.group.id, owners)
  }
}
function handleDeleteOwner(id: string) {
  groupStore.deleteGroupOwner(props.group.id, [id])
}
</script>

<template>
  <div
    class="border flex flex-col border-gray-400 h-1/2 relative justify-between">
    <h2 class="bg-white px-2 -top-3 left-2 absolute">グループオーナー</h2>
    <ul class="h-full p-4 overflow-y-scroll">
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
        v-model="OwnersToBeAdded"
        class="flex-grow"
        :close-on-select="false"
        label="name"
        multiple
        :options="users"
        placeholder="追加するオーナーを選択"
        :reduce="(user:any) => user.name" />
      <button @click="handleAddOwner(OwnersToBeAdded)">
        <PlusSmIcon class="w-8" />
      </button>
    </div>
  </div>
</template>
