<script lang="ts" setup>
import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { directionOptions } from '/@/stores/transaction'
import { useUserStore } from '/@/stores/user'

import NewTransactionTarget from '/@/components/newTransaction/NewTransactionTarget.vue'
import InputNumber from '/@/components/shared/InputNumber.vue'
import InputRadioButton from '/@/components/shared/InputRadioButton.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useNewTransaction } from './composables/useNewTransaction'

const userStore = useUserStore()
const tagStore = useTagStore()
const groupStore = useGroupStore()

const { transaction, moneyDirection, postTransaction } = useNewTransaction()

if (!groupStore.isGroupFetched) {
  await groupStore.fetchGroups()
}
if (!userStore.isUserFetched) {
  await userStore.fetchUsers()
}
if (!tagStore.isTagFetched) {
  await tagStore.fetchTags()
}
</script>

<template>
  <div v-if="!userStore.isAdmin()">権限がありません。</div>
  <div class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <div class="pb-8">
      <h1 class="text-center text-3xl">入出金記録の新規作成</h1>
    </div>
    <form class="flex flex-col gap-2">
      <div class="flex flex-col">
        <label>金額</label>
        <div>
          <InputNumber
            v-model="transaction.amount"
            auto-focus
            class="mr-1"
            :min="1" />円
        </div>
      </div>
      <div class="flex flex-col">
        <label>入出金</label>
        <InputRadioButton
          v-model="moneyDirection"
          :options="directionOptions" />
      </div>
      <NewTransactionTarget
        :targets="transaction.targets"
        @input="transaction.targets = $event" />
      <div class="flex flex-col">
        <label>グループ</label>
        <InputSelectSingle
          v-model="transaction.group"
          class="!w-2/3"
          :options="groupStore.groupOptions"
          placeholder="グループを選択" />
      </div>
      <div class="flex flex-col">
        <label>タグ</label>
        <InputSelectTagWithCreation v-model="transaction.tags" class="!w-2/3" />
      </div>
      <div class="text-right">
        <SimpleButton
          class="mb-4 w-64"
          font-size="xl"
          padding="sm"
          @click.stop="postTransaction">
          入出金記録を作成する
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
