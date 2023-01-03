<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

import type { Group, PostGroup } from '/@/lib/apis'
import apis from '/@/lib/apis'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import InputText from '/@/components/shared/InputText.vue'
import InputTextarea from '/@/components/shared/InputTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

const router = useRouter()

const userStore = useUserStore()
const groupStore = useGroupStore()
const { fetchUsers } = userStore
const { me, isUserFetched, userOptions } = storeToRefs(userStore)
const { groups } = storeToRefs(groupStore)

const toast = useToast()

const group = reactive({
  name: '',
  description: '',
  budget: 0,
  owners: me.value?.id ? [me.value.id] : [],
  members: []
})

const postGroup = async (group: PostGroup) => {
  try {
    const res = (await apis.postGroup(group)).data
    if (groups.value !== undefined) {
      groups.value.unshift(res)
    } else {
      groups.value = [res]
    }
    return res
  } catch {
    toast.error('グループの作成に失敗しました')
    throw new Error('グループの作成に失敗しました')
  }
}

const handlePostGroup = async (e: Event) => {
  e.preventDefault()
  if (group.owners.length === 0) {
    toast.warning('オーナーは必須です')
    return
  }
  const willPostGroup = {
    name: group.name,
    description: group.description,
    budget: group.budget
  }
  try {
    const res: Group = await postGroup(willPostGroup)
    await Promise.all([
      apis.postGroupMembers(res.id, group.members),
      apis.postGroupOwners(res.id, group.owners)
    ])
    toast.success('グループを作成しました')
    router.push(`/groups/${res.id}`)
  } catch {
    throw new Error('グループの作成に失敗しました')
  }
}

if (!isUserFetched.value) {
  await fetchUsers()
}
</script>

<template>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col">
    <div class="py-8">
      <h1 class="text-center text-3xl">グループの新規作成</h1>
    </div>
    <form class="flex flex-col gap-2" @submit="handlePostGroup">
      <div class="flex flex-col">
        <label>グループ名</label>
        <InputText
          v-model="group.name"
          placeholder="グループ名を入力"
          required />
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <InputTextarea
          v-model="group.description"
          placeholder="詳細を入力"
          required />
      </div>
      <div class="flex flex-col">
        <label>予算</label>
        <div>
          <InputNumber
            v-model="group.budget"
            class="mr-1 w-2/5"
            :min="1"
            required />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>オーナー</label>
        <InputSelectMultiple
          v-model="group.owners"
          :options="userOptions"
          placeholder="追加するオーナーを選択" />
      </div>
      <div class="flex flex-col">
        <label>メンバー</label>
        <InputSelectMultiple
          v-model="group.members"
          :options="userOptions"
          placeholder="追加するメンバーを選択" />
      </div>
      <div>
        <SimpleButton
          class="ml-auto mt-8 block"
          font-size="xl"
          padding="md"
          @click="handlePostGroup">
          グループを作成する
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
