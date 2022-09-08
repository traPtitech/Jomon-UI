<script lang="ts" setup>
import { MinusIcon, PlusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import UserIcon from '/@/components/shared/UserIcon.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'

import { useGroupMember } from './composables/useGroupMember'

interface Props {
  group: GroupDetail
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'fixGroup', group: GroupDetail): void }>()

const userStore = useUserStore()

const MembersToBeAdded = ref<string[]>([])
const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)
const { absentMembers, isSending, addMembers, removeMember } = useGroupMember(
  props.group
)
</script>

<template>
  <div
    class="relative flex h-1/2 flex-col justify-between border border-gray-300">
    <p class="bg-background absolute -top-3 left-2 px-2">グループメンバー</p>
    <ul class="h-full p-4">
      <li
        v-for="member in group.members"
        :key="member"
        class="not-first:mt-2 flex items-center justify-between">
        <div class="flex items-center">
          <UserIcon class="w-12" :name="member" />
          <p class="mx-1 break-all">{{ member }}</p>
        </div>
        <button
          v-if="hasAuthority"
          class="flex items-center"
          @click="removeMember(member, emit)">
          <MinusIcon v-if="!isSending" class="w-6" />
          <ArrowPathIcon v-else class="w-6 animate-spin" />
        </button>
      </li>
    </ul>
    <div v-if="hasAuthority" class="flex p-2">
      <VueSelect
        v-model="MembersToBeAdded"
        class="flex-grow"
        :close-on-select="false"
        label="name"
        multiple
        :options="absentMembers"
        placeholder="追加するメンバーを選択"
        :reduce="(user:any) => user.name" />
      <button
        class="flex items-center"
        @click="addMembers(MembersToBeAdded, emit)">
        <PlusIcon v-if="!isSending" class="ml-2 w-6" />
        <ArrowPathIcon v-else class="ml-2 w-6 animate-spin" />
      </button>
    </div>
  </div>
</template>