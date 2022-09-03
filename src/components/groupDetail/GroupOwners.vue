<script lang="ts" setup>
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import UserIcon from '/@/components/shared/UserIcon.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import apis from '/@/lib/apis'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'
import { useUserStore } from '/@/stores/user'

interface Props {
  group: GroupDetailType
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'fixGroup', group: GroupDetailType): void }>()
const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const OwnersToBeAdded = ref<string[]>([])

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
    <h2 class="absolute -top-3 left-2 bg-white px-2">グループオーナー</h2>
    <ul class="h-full overflow-y-scroll p-4">
      <li
        v-for="owner in group.owners"
        :key="owner"
        class="flex items-center justify-between">
        <div>
          <user-icon class="inline w-12" :name="owner" />
          {{ owner }}
        </div>
        <button @click="handleDeleteOwner(owner)">
          <minus-icon class="w-6" />
        </button>
      </li>
    </ul>
    <div class="flex p-2">
      <vue-select
        v-model="OwnersToBeAdded"
        class="flex-grow"
        :close-on-select="false"
        label="name"
        multiple
        :options="users"
        placeholder="追加するオーナーを選択"
        :reduce="(user:any) => user.name" />
      <button @click="handleAddOwners(OwnersToBeAdded)">
        <plus-icon class="ml-2 w-6" />
      </button>
    </div>
  </div>
</template>
