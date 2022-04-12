<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import Button from '/@/components/shared/Button.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { Group } from '/@/lib/apis'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

const userStore = useUserStore()
const groupStore = useGroupStore()
const { users } = storeToRefs(userStore)

const group = ref({
  name: '',
  description: '',
  budget: 0,
  owners: [] as string[],
  members: [] as string[]
})

async function handlePostGroup() {
  if (/^[1-9][0-9]*$|^0$/.test(group.value.budget.toString())) {
    const willPostGroup = {
      name: group.value.name,
      description: group.value.description,
      budget: group.value.budget
    }
    const res: Group = await groupStore.postGroup(willPostGroup)
    await groupStore.postGroupMember(res.id, group.value.members)
    await groupStore.postGroupOwner(res.id, group.value.owners)
  }
}
</script>

<template>
  <div class="p-12 h-full">
    <h1 class="text-3xl text-center mt-4 mb-12">グループの新規作成</h1>
    <div class="flex flex-col justify-between ml-12 mr-12 text-xl h-4/5">
      <div class="flex flex-col">
        <span>グループ名</span>
        <input v-model="group.name" class="border border-gray-300 w-4/5" />
      </div>
      <div class="flex flex-col">
        <span class="align-top">詳細</span>
        <textarea
          v-model="group.description"
          class="border border-gray-300 resize-none w-4/5" />
      </div>
      <div class="flex flex-col">
        <span>予算</span>
        <input v-model="group.budget" class="border border-gray-300 w-4/5" />
      </div>
      <div class="flex flex-col">
        <span>管理者</span>
        <VueSelect
          v-model="group.owners"
          class="w-2/3"
          :close-on-select="false"
          label="name"
          multiple
          :options="users"
          placeholder="追加する管理者を選択"
          :reduce="(user:any) => user.name" />
        注意：管理者は自動でメンバーには入りません。
      </div>
      <div class="flex flex-col">
        <span>メンバー</span>
        <VueSelect
          v-model="group.members"
          class="w-2/3"
          :close-on-select="false"
          label="name"
          multiple
          :options="users"
          placeholder="追加するメンバーを選択"
          :reduce="(user:any) => user.name" />
      </div>
      <div class="text-center">
        <Button
          class="w-48 mb-4"
          font-size="xl"
          padding="sm"
          @clock.stop="handlePostGroup">
          グループを作成する
        </Button>
      </div>
    </div>
  </div>
</template>
