<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import UserIcon from '/@/components/shared/UserIcon.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import apis from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'
import { useUserStore } from '/@/stores/user'

interface Props {
  group: GroupDetailType
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'fixGroup', group: GroupDetailType): void }>()

const userStore = useUserStore()

const MembersToBeAdded = ref<string[]>([])
const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)

async function handleAddMembers(members: string[]) {
  if (members.length !== 0) {
    try {
      const res = await apis.postGroupMembers(props.group.id, members)
      const nextGroup = {
        ...props.group,
        members: [...props.group.members, ...res.data]
      }
      emit('fixGroup', nextGroup)
    } catch (err) {
      alert(err)
    }
  }
}
async function handleDeleteMember(id: string) {
  try {
    await apis.deleteGroupMembers(props.group.id, [id])
    const nextGroup = {
      ...props.group,
      members: props.group.members.filter(member => member !== id)
    }
    emit('fixGroup', nextGroup)
  } catch (err) {
    alert(err)
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
        <button v-if="hasAuthority" @click="handleDeleteMember(member)">
          <minus-icon class="w-6" />
        </button>
      </li>
    </ul>
    <div v-if="hasAuthority" class="flex p-2">
      <vue-select
        v-model="MembersToBeAdded"
        class="flex-grow"
        :close-on-select="false"
        label="name"
        multiple
        :options="userStore.users"
        placeholder="追加するメンバーを選択"
        :reduce="(user:any) => user.name" />
      <button @click="handleAddMembers(MembersToBeAdded)">
        <plus-icon class="ml-2 w-6" />
      </button>
    </div>
  </div>
</template>
