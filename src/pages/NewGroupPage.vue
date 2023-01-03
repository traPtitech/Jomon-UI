<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import InputText from '/@/components/shared/InputText.vue'
import InputTextarea from '/@/components/shared/InputTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useNewGroup } from './composables/useNewGroup'

const userStore = useUserStore()
const { fetchUsers } = userStore
const { isUserFetched, userOptions } = storeToRefs(userStore)

const { isSending, group, postGroup } = useNewGroup()

if (!isUserFetched.value) {
  await fetchUsers()
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
          @click="postGroup">
          グループを作成する
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
