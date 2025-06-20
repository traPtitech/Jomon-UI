<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import SearchSelect from '/@/components/shared/SearchSelect.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import { useGroupMember } from './composables/useGroupMember'

const { me, userMap } = useUserStore()
const { canEditGroup, group } = useGroupDetailStore()

const membersToBeAdded = ref<string[]>([])
const { absentMemberOptions, isSending, addMembers, removeMember } =
  useGroupMember()
</script>

<template>
  <div v-if="group" class="relative flex flex-col gap-3 justify-between">
    <h2 class="text-xl">グループメンバー</h2>
    <div class="border border-surface-secondary">
      <ul class="flex flex-col gap-2 px-4 py-3 overflow-y-auto max-h-[50dvh]">
        <li
          v-for="member in group.members"
          :key="member"
          class="flex items-center justify-between">
          <div class="flex items-center">
            <UserIcon class="w-12" :name="userMap[member]" />
            <p class="mx-1 break-all">{{ userMap[member] }}</p>
          </div>
          <button
            v-if="canEditGroup(me)"
            class="flex items-center rounded-full p-1 hover:bg-surface-secondary"
            :disabled="isSending"
            @click="removeMember(member)">
            <MinusIcon class="w-6" />
          </button>
        </li>
      </ul>
      <div v-if="canEditGroup(me)" class="flex p-2 gap-2 w-full">
        <SearchSelect
          v-model="membersToBeAdded"
          class="grow w-1"
          multiple
          :options="absentMemberOptions"
          label="追加するメンバー" />
        <button
          class="flex items-center rounded-full p-1 hover:bg-surface-secondary"
          :disabled="membersToBeAdded.length === 0 || isSending"
          @click="addMembers(membersToBeAdded)">
          <PlusIcon class="w-6" />
        </button>
      </div>
    </div>
  </div>
</template>
