<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

import type { Group, PostGroup } from '/@/lib/apis'
import apis from '/@/lib/apis'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import VueSelect from '/@/components/shared/VueSelect.vue'

const emit = defineEmits<{
  (
    e: 'showToast',
    arg: {
      type: 'success' | 'error'
      message: string
    }
  ): void
}>()

const router = useRouter()

const userStore = useUserStore()
const groupStore = useGroupStore()

const group = ref({
  name: '',
  description: '',
  budget: 0,
  owners: userStore.me?.name ? [userStore.me.name] : [],
  members: []
})

const postGroup = async (group: PostGroup) => {
  try {
    const res = (await apis.postGroup(group)).data
    if (groupStore.groups !== undefined) {
      groupStore.groups.unshift(res)
    } else {
      groupStore.groups = [res]
    }
    return res
  } catch (err) {
    alert(err)
  }
}

async function handlePostGroup(e: Event) {
  e.preventDefault()
  if (group.value.owners.length === 0) {
    alert('オーナーを1人以上入れてください')
    return
  }
  const willPostGroup = {
    name: group.value.name,
    description: group.value.description,
    budget: group.value.budget
  }
  try {
    const res: Group | undefined = await postGroup(willPostGroup)
    if (res === undefined) {
      return
    }
    await Promise.all([
      apis.postGroupMembers(res.id, group.value.members),
      apis.postGroupOwners(res.id, group.value.owners)
    ])
    emit('showToast', {
      type: 'success',
      message: 'グループを作成しました'
    })
    router.push(`/groups/${res.id}`)
  } catch (err) {
    alert(err)
  }
}

if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
</script>

<!-- TODO: inputのon-focus -->
<template>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col">
    <div class="py-8">
      <h1 class="text-center text-3xl">グループの新規作成</h1>
    </div>
    <form class="flex flex-col gap-2" @submit="handlePostGroup">
      <div class="flex flex-col">
        <label>グループ名</label>
        <input
          v-model="group.name"
          class="bg-background rounded border border-gray-300 py-1 px-2"
          required />
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <textarea
          v-model="group.description"
          class="min-h-36 bg-background rounded border border-gray-300 py-1 px-2"
          required />
      </div>
      <div class="flex flex-col">
        <label>予算</label>
        <div>
          <input
            v-model="group.budget"
            class="bg-background mr-1 w-2/5 rounded border border-gray-300 py-1 px-2"
            :min="1"
            required
            type="number" />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>オーナー</label>
        <VueSelect
          v-model="group.owners"
          :close-on-select="false"
          label="name"
          multiple
          :options="userStore.users"
          placeholder="追加するオーナーを選択"
          :reduce="(user:any) => user.name" />
      </div>
      <div class="flex flex-col">
        <label>メンバー</label>
        <VueSelect
          v-model="group.members"
          :close-on-select="false"
          label="name"
          multiple
          :options="userStore.users"
          placeholder="追加するメンバーを選択"
          :reduce="(user:any) => user.name" />
      </div>
      <div>
        <SimpleButton class="ml-auto mt-8 block" font-size="xl" padding="md">
          グループを作成する
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
