<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import FormSelect from '/@/components/shared/FormSelect.vue'
import UserIcon from '/@/components/shared/UserIcon.vue'

import { useGroupOwner } from './composables/useGroupOwner'

interface Props {
  group: GroupDetail
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'fixGroup', group: GroupDetail): void }>()

const userStore = useUserStore()

const OwnersToBeAdded = ref<string[]>([])
const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)
const { absentOwnersOption, isSending, addOwners, removeOwner } = useGroupOwner(
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
          :is-disabled="isSending"
          @click="removeOwner(owner, emit)">
          <MinusIcon class="w-6" />
        </button>
      </li>
    </ul>
    <div v-if="hasAuthority" class="flex p-2">
      <!--todo:https://vue-select.org/guide/positioning.html#default-->
      <FormSelect
        v-model="OwnersToBeAdded"
        class="flex-grow"
        is-multiple
        :options="absentOwnersOption"
        placeholder="追加するオーナーを選択" />
      <button
        class="flex items-center"
        :is-disabled="isSending"
        @click="addOwners(OwnersToBeAdded, emit)">
        <PlusIcon class="ml-2 w-6" />
      </button>
    </div>
  </div>
</template>
