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
  <div class="pt-8 px-60 h-full">
    <h1 class="text-3xl text-center">グループの新規作成</h1>
    <div class="flex flex-col justify-between mt-8 ml-12 mr-12 text-xl h-4/5">
      <div class="flex flex-col">
        <label>グループ名</label>
        <input v-model="group.name" class="border border-gray-300" />
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <textarea
          v-model="group.description"
          class="border border-gray-300 resize-none" />
      </div>
      <div class="flex flex-col">
        <label>予算</label>
        <div>
          <input
            v-model="group.budget"
            class="border border-gray-300 w-2/5" />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>オーナー</label>
        <VueSelect
          v-model="group.owners"
          class="w-4/5"
          :close-on-select="false"
          label="name"
          multiple
          :options="users"
          placeholder="追加するオーナーを選択"
          :reduce="(user:any) => user.name" />
        注意：オーナーは自動でメンバーには入りません。
      </div>
      <div class="flex flex-col">
        <label>メンバー</label>
        <VueSelect
          v-model="group.members"
          class="w-4/5"
          :close-on-select="false"
          label="name"
          multiple
          :options="users"
          placeholder="追加するメンバーを選択"
          :reduce="(user:any) => user.name" />
      </div>
      <div class="text-right">
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
