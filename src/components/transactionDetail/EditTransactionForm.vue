<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'

import type { Tag, Transaction } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { formatDate } from '/@/lib/date'
import { toId } from '/@/lib/parsePathParams'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputRadioButton from '/@/components/shared/InputRadioButton.vue'
import InputSelect from '/@/components/shared/InputSelect.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import type { MoneyDirection } from '/@/pages/composables/useNewTransaction'

interface Props {
  transaction: Transaction
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'edited', value: Transaction | undefined): void
}>()

const route = useRoute()
const id = toId(route.params.id)

const tagStore = useTagStore()
const groupStore = useGroupStore()
const toast = useToast()

const directionOptions = [
  {
    key: 'traPへ入金',
    value: 'toTraP'
  },
  {
    key: 'traPから出金',
    value: 'fromTraP'
  }
]

const editedValue = ref({
  amount: props.transaction.amount,
  target: props.transaction.target,
  request: props.transaction.request,
  tags: props.transaction.tags,
  group: props.transaction.group.id
})
const moneyDirection = ref<MoneyDirection>('toTraP')

async function handlePutTransaction() {
  if (props.transaction === undefined) {
    return
  }
  let tags: Tag[]
  try {
    tags = await tagStore.createTagIfNotExist(editedValue.value.tags)
  } catch {
    return
  }
  const transaction = {
    ...editedValue.value,
    amount:
      moneyDirection.value === 'toTraP'
        ? editedValue.value.amount
        : -editedValue.value.amount,
    tags: tags.map(tag => tag.id)
  }
  try {
    const res = (await apis.putTransactionDetail(id, transaction)).data
    emit('edited', res)
  } catch {
    toast.error('入出金記録の修正に失敗しました')
    emit('edited', undefined)
  }
}
</script>

<template>
  <form class="mb-4 space-y-2">
    <div class="flex flex-col">
      <label>年月日</label><span>{{ formatDate(transaction.created_at) }}</span>
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
      <InputSelect
        v-model="editedValue.group"
        :options="groupStore.groupOptions"
        placeholder="グループを選択" />
    </div>
    <div class="flex flex-col">
      <label>タグ</label>
      <InputSelectTagWithCreation
        v-model="editedValue.tags"
        class="w-1/3"
        placeholder="タグを選択" />
    </div>
    <div class="text-right">
      <SimpleButton
        font-size="sm"
        padding="sm"
        @click.prevent="handlePutTransaction">
        完了
      </SimpleButton>
    </div>
  </form>
</template>
