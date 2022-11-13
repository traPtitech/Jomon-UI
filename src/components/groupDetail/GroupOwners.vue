<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import InputSelect from '/@/components/shared/InputSelect.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import { useGroupOwner } from './composables/useGroupOwner'

const userStore = useUserStore()
const groupDetailStore = useGroupDetailStore()
const { group } = storeToRefs(groupDetailStore)

const OwnersToBeAdded = ref<string[]>([])
const hasAuthority = groupDetailStore.canEditGroup(userStore.me)
const { absentOwnerOptions, isSending, addOwners, removeOwner } =
  useGroupOwner()
</script>

<template>
  <div
    v-if="group"
    class="relative flex h-2/5 flex-col justify-between border border-gray-300">
    <p class="bg-background absolute -top-3 left-2 px-2">グループオーナー</p>
    <ul class="h-full p-4">
      <li
        v-for="owner in group.owners"
        :key="owner"
        class="not-first:mt-2 flex items-center justify-between">
        <div class="items-cente flex">
          <UserIcon class="w-12" :name="owner" />
          <p class="mx-1 break-all">{{ owner }}</p>
        </div>
        <button
          v-if="hasAuthority"
          class="flex items-center rounded-full p-1 hover:bg-gray-300"
          :is-disabled="isSending"
          @click="removeOwner(owner)">
          <MinusIcon class="w-6" />
        </button>
      </li>
    </ul>
    <div v-if="hasAuthority" class="flex p-2">
      <!--todo:https://vue-select.org/guide/positioning.html#default-->
      <InputSelect
        v-model="OwnersToBeAdded"
        class="mr-2 flex-grow"
        is-multiple
        :options="absentOwnerOptions"
        placeholder="追加するオーナーを選択" />
      <button
        class="flex items-center rounded-full p-1 hover:bg-gray-300"
        :is-disabled="isSending"
        @click="addOwners(OwnersToBeAdded)">
        <PlusIcon class="w-6" />
      </button>
    </div>
  </div>
</template>
