<script lang="ts" setup>
import { useGroupStore } from '/@/stores/group'
import { directionOptions } from '/@/stores/transaction'

import type { Transaction } from '/@/lib/apiTypes'
import { formatDate } from '/@/lib/date'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputRadioButton from '/@/components/shared/InputRadioButton.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useEditTransaction } from './composables/useEditTransation'

interface Props {
  transaction: Transaction
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'edited', value: Transaction | undefined): void
}>()

const groupStore = useGroupStore()
const {
  editedValue,
  moneyDirection,
  linkedRequest,
  putTransaction,
  updateLinkedRequest,
  unlinkRequest
} = useEditTransaction(props.transaction)

const formattedDate = formatDate(props.transaction.created_at)
</script>

<template>
  <form class="mb-4 space-y-2">
    <div class="flex flex-col">
      <label>紐づける申請</label>
      <div class="flex gap-4">
        <InputText
          v-model="linkedRequest"
          class="w-1/2"
          placeholder="紐づける申請のURLを入力" />
        <SimpleButton
          font-size="sm"
          padding="sm"
          type="plain"
          @click="updateLinkedRequest(linkedRequest, emit)">
          紐づける申請を更新
        </SimpleButton>
        <SimpleButton
          font-size="sm"
          padding="sm"
          type="danger"
          @click="unlinkRequest(emit)">
          申請との紐づけを解除
        </SimpleButton>
      </div>
    </div>
    <div class="flex flex-col">
      <label>年月日</label>
      <span>{{ formattedDate }}</span>
    </div>
    <div class="flex flex-col">
      <label>取引額</label>
      <div>
        <InputNumber
          v-model="editedValue.amount"
          class="mr-1"
          :min="1"
          placeholder="金額" />円
      </div>
    </div>
    <div class="flex flex-col">
      <label>お金の方向</label>
      <InputRadioButton v-model="moneyDirection" :options="directionOptions" />
    </div>
    <div class="flex flex-col">
      <label>取引相手</label>
      <InputText v-model="editedValue.target" placeholder="取引相手を入力" />
    </div>
    <div class="flex flex-col">
      <label>取引グループ</label>
      <InputSelectSingle
        v-model="editedValue.group"
        :options="groupStore.groupOptions"
        placeholder="グループを選択" />
    </div>
    <div class="flex flex-col">
      <label>タグ</label>
      <InputSelectTagWithCreation v-model="editedValue.tags" class="w-1/3" />
    </div>
    <div class="text-right">
      <SimpleButton
        font-size="sm"
        padding="sm"
        @click.prevent="putTransaction(emit)">
        完了
      </SimpleButton>
    </div>
  </form>
</template>
