<script lang="ts" setup>
import { MinusIcon, PlusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import UserIcon from '/@/components/shared/UserIcon.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'

import { useGroupOwner } from './composables/useGroupOwner'

interface Props {
  group: GroupDetail
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'fixGroup', group: GroupDetail): void }>()

const userStore = useUserStore()

const OwnersToBeAdded = ref<string[]>([])
const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)
const { absentOwners, isSending, addOwners, removeOwner } = useGroupOwner(
  props.group
)
</script>

<template>
  <div
    class="relative flex h-1/2 flex-col justify-between border border-gray-300">
    <p class="bg-background absolute -top-3 left-2 px-2">グループオーナー</p>
    <ul class="h-full p-4">
      <li
        v-for="owner in group.owners"
        :key="owner"
        class="not-first:mt-2 flex items-center justify-between">
        <div class="flex items-center">
          <UserIcon class="w-12" :name="owner" />
          <p class="mx-1 break-all">{{ owner }}</p>
        </div>
        <button
          v-if="hasAuthority"
          class="flex items-center"
          @click="removeOwner(owner, emit)">
          <MinusIcon v-if="!isSending" class="w-6" />
          <ArrowPathIcon v-else class="w-6 animate-spin" />
        </button>
      </li>
    </ul>
    <div v-if="hasAuthority" class="flex p-2">
      <!--todo:https://vue-select.org/guide/positioning.html#default-->
      <VueSelect
        v-model="OwnersToBeAdded"
        class="flex-grow"
        :close-on-select="false"
        label="name"
        multiple
        :options="absentOwners"
        placeholder="追加するオーナーを選択"
        :reduce="(user:any) => user.name" />
      <button
        class="flex items-center"
        @click="addOwners(OwnersToBeAdded, emit)">
        <PlusIcon v-if="!isSending" class="ml-2 w-6" />
        <ArrowPathIcon v-else class="ml-2 w-6 animate-spin" />
      </button>
    </div>
  </div>
</template>
