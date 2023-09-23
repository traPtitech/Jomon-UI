<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useUserStore } from '/@/stores/user'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import InputText from '/@/components/shared/InputText.vue'
import InputTextarea from '/@/components/shared/InputTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { createGroupUsecase } from '/@/features/group/usecase'
import { useFetchUsers } from '/@/features/user/usecase'

import { useNewGroup } from './composables/useNewGroup'

const toast = useToast()
const router = useRouter()

const userStore = useUserStore()
const { isUserFetched, userOptions } = storeToRefs(userStore)

const { isSending, group } = useNewGroup()

const handleCreateGroup = async () => {
  try {
    await createGroupUsecase(group.value)
    toast.success('グループを作成しました')
    router.push('/groups')
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
}

if (!isUserFetched.value) {
  await useFetchUsers()
}
</script>

<template>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col">
    <div class="py-8">
      <h1 class="text-center text-3xl">グループの新規作成</h1>
    </div>
    <form class="flex flex-col gap-2">
      <div class="flex flex-col">
        <label>グループ名</label>
        <InputText
          v-model="group.name"
          auto-focus
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
          :disabled="isSending"
          font-size="xl"
          padding="md"
          @click="handleCreateGroup">
          グループを作成する
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
