<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import { useGroupOwner } from './composables/useGroupOwner'

const { me, userMap } = useUserStore()
const { canEditGroup, group } = useGroupDetailStore()

const ownersToBeAdded = ref<string[]>([])
const { absentOwnerOptions, isSending, addOwners, removeOwner } =
  useGroupOwner()
</script>

<template>
  <div v-if="group" class="relative flex flex-col gap-3 justify-between">
    <h2 class="text-xl">グループオーナー</h2>
    <div class="border border-surface-secondary">
      <ul class="flex flex-col gap-2 px-4 py-3 overflow-y-auto max-h-[50dvh]">
        <li
          v-for="owner in group.owners"
          :key="owner"
          class="flex items-center justify-between">
          <div class="flex items-center">
            <UserIcon class="w-12" :name="userMap[owner]" />
            <p class="mx-1 break-all">{{ userMap[owner] }}</p>
          </div>
          <button
            v-if="canEditGroup(me)"
            class="flex items-center rounded-full p-1 hover:bg-surface-secondary"
            :disabled="isSending"
            @click="removeOwner(owner)">
            <MinusIcon class="w-6" />
          </button>
        </li>
      </ul>
      <div v-if="canEditGroup(me)" class="flex p-2 gap-2">
        <InputSelectMultiple
          v-model="ownersToBeAdded"
          class="grow w-1"
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
  </div>
</template>
