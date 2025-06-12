<script lang="ts" setup>
import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import { directionOptions } from '/@/stores/transaction'
import { useUserStore } from '/@/stores/user'

import NewTransactionTarget from '/@/components/newTransaction/NewTransactionTarget.vue'
import InputRadioButton from '/@/components/shared/InputRadioButton.vue'
import BaseInput from '/@/components/shared/BaseInput.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import SearchSelectTag from '/@/components/shared/SearchSelectTag.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

import { useNewTransaction } from './composables/useNewTransaction'

const { isUserFetched, isAdmin } = useUserStore()
const { isTagFetched } = useTagStore()
const { isGroupFetched, groupOptions } = useGroupStore()

const { isSending, transaction, moneyDirection, postTransaction } =
  useNewTransaction()

if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
if (!isTagFetched.value) {
  await useFetchTagsUsecase()
}
</script>

<template>
  <div v-if="!isAdmin" role="alert" aria-live="assertive">
    権限がありません。
  </div>
  <div v-else>
    <div class="pb-6">
      <h1 class="text-2xl">入出金記録の新規作成</h1>
    </div>
    <form class="flex flex-col gap-6" aria-label="入出金記録作成フォーム">
      <BaseInput v-model="transaction.title" label="タイトル" required />
      <BaseInput
        v-model="transaction.amount"
        type="number"
        label="金額"
        required>
        <span class="text-2xl font-bold ml-3 mt-auto mb-2 text-text-secondary">
          ¥
        </span>
      </BaseInput>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium" for="direction">入出金の方向</label>
        <InputRadioButton
          id="direction"
          v-model="moneyDirection"
          :options="directionOptions" />
      </div>
      <NewTransactionTarget v-model:targets="transaction.targets" />
      <SearchSelect
        v-model="transaction.group"
        class="w-full"
        :options="groupOptions"
        label="グループ" />
      <SearchSelectTag v-model="transaction.tags" />
      <div class="text-right">
        <SimpleButton
          :disabled="isSending"
          font-size="base"
          padding="md"
          aria-label="入出金記録を作成"
          @click.stop="postTransaction">
          入出金記録を作成
        </SimpleButton>
      </div>
    </form>
  </div>
</template>
