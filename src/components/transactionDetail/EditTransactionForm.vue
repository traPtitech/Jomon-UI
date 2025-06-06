<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { directionOptions } from '/@/stores/transaction'

import { formatDate } from '/@/lib/date'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputRadioButton from '/@/components/shared/InputRadioButton.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { Transaction } from '/@/features/transaction/model'

import { useEditTransaction } from './composables/useEditTransation'

interface Props {
  transaction: Transaction
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'finishEditing', value: Transaction): void
  (e: 'cancel'): void
}>()

const groupStore = useGroupStore()
const {
  isSending,
  editedValue,
  moneyDirection,
  linkedRequest,
  finishEditing,
  updateLinkedRequest,
  unlinkRequest
} = useEditTransaction(props.transaction)
const { groupOptions } = storeToRefs(groupStore)

const formattedDate = computed(() => formatDate(props.transaction.createdAt))
</script>

<template>
  <form class="flex flex-col gap-2" aria-label="取引編集フォーム">
    <div class="flex flex-col">
      <label for="linked-request">紐づける申請</label>
      <div class="flex gap-4">
        <InputText
          id="linked-request"
          v-model="linkedRequest"
          auto-focus
          class="w-1/2"
          placeholder="紐づける申請のURLを入力" />
        <SimpleButton
          :disabled="isSending"
          font-size="sm"
          padding="sm"
          type="success"
          @click="updateLinkedRequest(linkedRequest, emit)">
          紐づける申請を更新
        </SimpleButton>
        <SimpleButton
          :disabled="isSending"
          font-size="sm"
          padding="sm"
          type="danger"
          @click="unlinkRequest(emit)">
          申請との紐づけを解除
        </SimpleButton>
      </div>
    </div>
    <div class="flex flex-col">
      <label for="date">年月日</label>
      <span id="date">{{ formattedDate }}</span>
    </div>
    <div class="flex flex-col">
      <label for="amount">取引額</label>
      <div>
        <InputNumber
          id="amount"
          v-model="editedValue.amount"
          class="mr-1"
          :min="1"
          placeholder="金額" />円
      </div>
    </div>
    <div class="flex flex-col">
      <label for="direction">お金の方向</label>
      <InputRadioButton
        id="direction"
        v-model="moneyDirection"
        :options="directionOptions" />
    </div>
    <div class="flex flex-col">
      <label for="target">取引相手</label>
      <InputText
        id="target"
        v-model="editedValue.target"
        placeholder="取引相手を入力" />
    </div>
    <div class="flex flex-col">
      <label for="group">取引グループ</label>
      <InputSelectSingle
        id="group"
        v-model="editedValue.group"
        :options="groupOptions"
        placeholder="グループを選択" />
    </div>
    <div class="flex flex-col">
      <label for="tags">タグ</label>
      <InputSelectTagWithCreation
        id="tags"
        v-model="editedValue.tags"
        class="w-1/3" />
    </div>
    <div class="flex items-center justify-end gap-4">
      <SimpleButton font-size="sm" padding="sm" @click="emit('cancel')">
        キャンセル
      </SimpleButton>
      <SimpleButton
        :disabled="isSending"
        font-size="sm"
        padding="sm"
        type="success"
        @click="finishEditing(emit)">
        完了
      </SimpleButton>
    </div>
  </form>
</template>
