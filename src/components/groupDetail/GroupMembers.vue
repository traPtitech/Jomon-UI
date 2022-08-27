<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import UserIcon from '/@/components/shared/UserIcon.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { Group } from '/@/lib/apis'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

interface Props {
  group: Group
}

const props = defineProps<Props>()
const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const groupStore = useGroupStore()
const MembersToBeAdded = ref<string[]>([])

function handleDeleteMember(id: string) {
  groupStore.deleteGroupMember(props.group.id, [id])
}

function handleAddMember(members: string[]) {
  if (members.length !== 0) {
    groupStore.postGroupOwner(props.group.id, members)
  }
}
</script>

<template>
  <div
    class="relative flex h-1/2 flex-col justify-between border border-gray-400">
    <h2 class="absolute -top-3 left-2 bg-white px-2">グループメンバー</h2>
    <ul class="h-full overflow-y-scroll p-4">
      <li
        v-for="member in group.members"
        :key="member"
        class="flex items-center justify-between">
        <div>
          <user-icon class="inline w-12" :name="member" />
          {{ member }}
        </div>
        <button @click="handleDeleteMember(member)">
          <minus-icon class="w-6" />
        </button>
      </li>
    </ul>
    <div class="flex p-2">
      <vue-select
        v-model="MembersToBeAdded"
        class="flex-grow"
        :close-on-select="false"
        label="name"
        multiple
        :options="users"
        placeholder="追加するメンバーを選択"
        :reduce="(user:any) => user.name" />
      <button @click="handleAddMember(MembersToBeAdded)">
        <plus-icon class="ml-2 w-6" />
      </button>
    </div>
  </div>
</template>
