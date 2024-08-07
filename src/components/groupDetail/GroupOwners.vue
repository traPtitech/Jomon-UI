<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import { useGroupOwner } from './composables/useGroupOwner'

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()
const { canEditGroup } = groupDetailStore
const { group } = storeToRefs(groupDetailStore)
const { me, userMap } = storeToRefs(userStore)

const ownersToBeAdded = ref<string[]>([])
const hasAuthority = canEditGroup(me.value)
const { absentOwnerOptions, isSending, addOwners, removeOwner } =
  useGroupOwner()
</script>

<template>
  <div
    v-if="group"
    class="relative flex h-2/5 flex-col justify-between border border-surface-secondary">
    <p class="bg-surface-primary absolute -top-3 left-2 px-2">
      グループオーナー
    </p>
    <ul class="h-full p-4">
      <li
        v-for="owner in group.owners"
        :key="owner"
        class="not-first:mt-2 flex items-center justify-between">
        <div class="flex items-center">
          <UserIcon class="w-12" :name="userMap[owner]" />
          <p class="mx-1 break-all">{{ userMap[owner] }}</p>
        </div>
        <button
          v-if="hasAuthority"
          class="flex items-center rounded-full p-1 hover:bg-surface-secondary"
          :disabled="isSending"
          @click="removeOwner(owner)">
          <MinusIcon class="w-6" />
        </button>
      </li>
    </ul>
    <div v-if="hasAuthority" class="flex p-2">
      <InputSelectMultiple
        v-model="ownersToBeAdded"
        class="mr-2 flex-grow"
        :options="absentOwnerOptions"
        placeholder="追加するオーナーを選択" />
      <button
        class="flex items-center rounded-full p-1 hover:bg-surface-secondary"
        :disabled="ownersToBeAdded.length === 0 || isSending"
        @click="addOwners(ownersToBeAdded)">
        <PlusIcon class="w-6" />
      </button>
    </div>
  </div>
</template>
