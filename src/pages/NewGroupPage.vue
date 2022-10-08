<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useToastStore } from '/@/stores/toast'
import { useUserStore } from '/@/stores/user'

import type { Group, PostGroup } from '/@/lib/apis'
import apis from '/@/lib/apis'

import FormInput from '/@/components/shared/FormInput.vue'
import FormInputNumber from '/@/components/shared/FormInputNumber.vue'
import FormSelect from '/@/components/shared/FormSelect.vue'
import FormTextarea from '/@/components/shared/FormTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

const router = useRouter()

const userStore = useUserStore()
const groupStore = useGroupStore()

const toastStore = useToastStore()

const group = ref({
  name: '',
  description: '',
  budget: 0,
  owners: userStore.me?.name ? [userStore.me.name] : [],
  members: []
})
const membersOption = computed(() => {
  return (
    userStore.users?.map(user => {
      return {
        key: user.name,
        value: user.name
      }
    }) ?? []
  )
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
  } catch {
    toastStore.showToast({
      type: 'error',
      message: 'グループの作成に失敗しました'
    })
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
    toastStore.showToast({
      type: 'success',
      message: 'グループを作成しました'
    })
    router.push(`/groups/${res.id}`)
  } catch {
    throw new Error('グループの作成に失敗しました')
  }
}

if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
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
        <FormInput v-model="group.name" required />
      </div>
      <div class="flex flex-col">
        <label>詳細</label>
        <FormTextarea v-model="group.description" required />
      </div>
      <div class="flex flex-col">
        <label>予算</label>
        <div>
          <FormInputNumber
            v-model="group.budget"
            class="mr-1 w-2/5"
            :min="1"
            required />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>オーナー</label>
        <FormSelect
          v-model="group.owners"
          is-multiple
          :options="membersOption"
          placeholder="追加するオーナーを選択" />
      </div>
      <div class="flex flex-col">
        <label>メンバー</label>
        <FormSelect
          v-model="group.members"
          is-multiple
          :options="membersOption"
          placeholder="追加するメンバーを選択" />
      </div>
      <div>
        <SimpleButton class="ml-auto mt-8 block" font-size="xl" padding="md">
          グループを作成する
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
