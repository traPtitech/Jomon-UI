<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import Button from '/@/components/shared/Button.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'
import type { Group, PostGroup } from '/@/lib/apis'
import apis from '/@/lib/apis'
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

const postGroup = async (group: PostGroup) => {
  try {
    const res = (await apis.postGroup(group)).data
    groupStore.groups = [...groupStore.groups, res]
    return res
  } catch (err: any) {
    alert(err.message)
  }
}

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
    const res: Group = await postGroup(willPostGroup)
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
    <div class="flex flex-col mx-auto min-w-160 w-2/3">
      <div class="py-8">
        <h1 class="text-center text-3xl">グループの新規作成</h1>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          <label>グループ名</label>
          <input
            v-model="group.name"
            class="border rounded border-gray-300 py-1 px-2" />
        </div>
        <div class="flex flex-col">
          <label>詳細</label>
          <textarea
            v-model="group.description"
            class="border rounded border-gray-300 min-h-36 py-1 px-2" />
        </div>
        <div class="flex flex-col">
          <label>予算</label>
          <div>
            <input
              v-model="group.budget"
              class="border rounded border-gray-300 py-1 px-2 w-2/5" />円
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
        <div class="w-full relative">
          <Button
            class="mt-8 right-0 absolute"
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
