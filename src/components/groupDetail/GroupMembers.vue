<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import { useGroupMember } from './composables/useGroupMember'

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()
const { canEditGroup } = groupDetailStore
const { group } = storeToRefs(groupDetailStore)
const { me, userMap } = storeToRefs(userStore)

const membersToBeAdded = ref<string[]>([])
const hasAuthority = canEditGroup(me.value)
const { absentMemberOptions, isSending, addMembers, removeMember } =
  useGroupMember()
</script>

<template>
  <div
    v-if="group"
    class="relative flex h-2/5 flex-col justify-between border border-gray-300">
    <p class="bg-background absolute -top-3 left-2 px-2">グループメンバー</p>
    <ul class="h-full p-4">
      <li
        v-for="member in group.members"
        :key="member"
        class="not-first:mt-2 flex items-center justify-between">
        <div class="flex items-center">
          <UserIcon class="w-12" :name="userMap[member]" />
          <p class="mx-1 break-all">{{ userMap[member] }}</p>
        </div>
        <button
          v-if="hasAuthority"
          class="flex items-center rounded-full p-1 hover:bg-gray-300"
          :disabled="isSending"
          @click="removeMember(member)">
          <MinusIcon class="w-6" />
        </button>
      </li>
    </ul>
    <div v-if="hasAuthority" class="flex p-2">
      <InputSelectMultiple
        v-model="membersToBeAdded"
        class="mr-2 flex-grow"
        is-dropdown-above
        :options="absentMemberOptions"
        placeholder="追加するメンバーを選択" />
      <button
        class="flex items-center rounded-full p-1 hover:bg-gray-300"
        :disabled="membersToBeAdded.length === 0 || isSending"
        @click="addMembers(membersToBeAdded)">
        <PlusIcon class="w-6" />
      </button>
    </div>
  </div>
</template>
