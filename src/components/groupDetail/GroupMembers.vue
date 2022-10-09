<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import FormSelect from '/@/components/shared/FormSelect.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import { useGroupMember } from './composables/useGroupMember'

interface Props {
  group: GroupDetail
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'fixGroup', group: GroupDetail): void }>()

const userStore = useUserStore()

const MembersToBeAdded = ref<string[]>([])
const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)
const { absentMemberOptions, isSending, addMembers, removeMember } =
  useGroupMember(props.group)
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
          class="flex items-center rounded-full p-1 hover:bg-gray-300"
          :is-disabled="isSending"
          @click="removeMember(member, emit)">
          <MinusIcon class="w-6" />
        </button>
      </li>
    </ul>
    <div v-if="hasAuthority" class="flex p-2">
      <FormSelect
        v-model="MembersToBeAdded"
        class="mr-2 flex-grow"
        is-multiple
        :options="absentMemberOptions"
        placeholder="追加するメンバーを選択" />
      <button
        class="flex items-center rounded-full p-1 hover:bg-gray-300"
        :is-disabled="isSending"
        @click="addMembers(MembersToBeAdded, emit)">
        <PlusIcon class="w-6" />
      </button>
    </div>
  </div>
</template>
