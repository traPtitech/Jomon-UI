<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useGroupStore } from '/@/stores/group'
import { directionOptions } from '/@/stores/transaction'

import { formatDate } from '/@/lib/date'

import BaseInput from '/@/components/shared/BaseInput.vue'
import InputRadioButton from '/@/components/shared/InputRadioButton.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import SearchSelectTag from '/@/components/shared/SearchSelectTag.vue'
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
  <form class="flex flex-col gap-6" aria-label="取引編集フォーム">
    <BaseInput v-model="editedValue.title" label="タイトル" />
    <div class="flex flex-col gap-2">
      <div class="flex gap-4">
        <BaseInput
          v-model="linkedRequest"
          label="紐づける申請"
          class="w-1/2"
          placeholder="https://jomon.trap.jp/requests/..." />
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
    <BaseInput v-model="editedValue.amount" type="number" label="取引額">
      <span class="text-2xl font-bold ml-3 mt-auto mb-2 text-text-secondary">
        ¥
      </span>
    </BaseInput>
    <div class="flex flex-col">
      <label for="direction">お金の方向</label>
      <InputRadioButton
        id="direction"
        v-model="moneyDirection"
        :options="directionOptions" />
    </div>
    <BaseInput v-model="editedValue.target" label="取引相手" />
    <SearchSelect
      id="group"
      v-model="editedValue.group"
      :options="groupOptions"
      label="取引グループ" />
    <SearchSelectTag v-model="editedValue.tags" class="w-1/3" />
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
