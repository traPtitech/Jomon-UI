<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

import type { Group } from '/@/lib/apis'

import Button from '/@/components/shared/Button.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'

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
  if (
    /^[1-9][0-9]*$|^0$/.test(group.value.budget.toString()) &&
    group.value.name !== '' &&
    group.value.description !== '' &&
    group.value.owners.length > 0 &&
    group.value.members.length > 0
  ) {
    const willPostGroup = {
      name: group.value.name,
      description: group.value.description,
      budget: group.value.budget
    }
    const res: Group = await groupStore.postGroup(willPostGroup)
    await groupStore.postGroupMember(res.id, group.value.members)
    await groupStore.postGroupOwner(res.id, group.value.owners)
  } else {
    alert('全ての項目を入力してください')
  }
}
</script>

<!-- TODO: inputのon-focus -->
<template>
  <div>
    <div class="min-w-160 mx-auto flex w-2/3 flex-col">
      <div class="py-8">
        <h1 class="text-center text-3xl">グループの新規作成</h1>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <label>グループ名</label>
          <input
            v-model="group.name"
            class="rounded border border-gray-300 py-1 px-2" />
        </div>
        <div class="flex flex-col">
          <label>詳細</label>
          <textarea
            v-model="group.description"
            class="min-h-36 rounded border border-gray-300 py-1 px-2" />
        </div>
        <div class="flex flex-col">
          <label>予算</label>
          <div>
            <input
              v-model="group.budget"
              class="w-2/5 rounded border border-gray-300 py-1 px-2" />円
          </div>
        </div>
        <div class="flex flex-col">
          <label>オーナー</label>
          <VueSelect
            v-model="group.owners"
            :close-on-select="false"
            label="name"
            multiple
            :options="users"
            placeholder="追加するオーナーを選択"
            :reduce="(user:any) => user.name" />
          <span class="text-sm">
            注意：オーナーは自動でメンバーには入りません。
          </span>
        </div>
        <div class="flex flex-col">
          <label>メンバー</label>
          <VueSelect
            v-model="group.members"
            :close-on-select="false"
            label="name"
            multiple
            :options="users"
            placeholder="追加するメンバーを選択"
            :reduce="(user:any) => user.name" />
        </div>
        <div class="relative w-full">
          <Button
            class="absolute right-0 mt-8"
            font-size="xl"
            padding="md"
            @clock.stop="handlePostGroup">
            グループを作成する
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
