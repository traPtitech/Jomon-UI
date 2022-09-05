<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import UserIcon from '/@/components/shared/UserIcon.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'

interface Props {
  group: GroupDetailType
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'fixGroup', group: GroupDetailType): void }>()

const userStore = useUserStore()

const OwnersToBeAdded = ref<string[]>([])
const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)

async function handleAddOwners(owners: string[]) {
  if (owners.length !== 0) {
    try {
      const res = await apis.postGroupOwners(props.group.id, owners)
      const nextGroup = {
        ...props.group,
        owners: [...props.group.owners, ...res.data]
      }
      emit('fixGroup', nextGroup)
    } catch (err) {
      alert(err)
    }
  }
}
async function handleDeleteOwner(id: string) {
  try {
    await apis.deleteGroupOwners(props.group.id, [id])
    const nextGroup = {
      ...props.group,
      owners: props.group.owners.filter(owner => owner !== id)
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
    <h2 class="absolute -top-3 left-2 bg-zinc-50 px-2">グループオーナー</h2>
    <ul class="h-full p-4">
      <li
        v-for="owner in group.owners"
        :key="owner"
        class="flex items-center justify-between">
        <div>
          <UserIcon class="inline w-12" :name="owner" />
          {{ owner }}
        </div>
        <button
          v-if="hasAuthority"
          class="flex items-center"
          @click="handleDeleteOwner(owner)">
          <MinusIcon class="w-6" />
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
        :options="userStore.users"
        placeholder="追加するオーナーを選択"
        :reduce="(user:any) => user.name" />
      <button
        class="flex items-center"
        @click="handleAddOwners(OwnersToBeAdded)">
        <PlusIcon class="ml-2 w-6" />
      </button>
    </div>
  </div>
</template>
