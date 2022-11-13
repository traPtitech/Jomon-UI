<script lang="ts" setup>
import { DateTime } from 'luxon'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'
import { useTagStore } from '/@/stores/tag'
import type { Transaction } from '/@/stores/transaction'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'
import { formatDate } from '/@/lib/date'
import { toId } from '/@/lib/parsePathParams'

import InputNumber from '/@/components/shared/InputNumber.vue'
import InputSelect from '/@/components/shared/InputSelect.vue'
import InputSelectTagWithCreation from '/@/components/shared/InputSelectTagWithCreation.vue'
import InputText from '/@/components/shared/InputText.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

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

const editedValue = ref({
  amount: props.transaction.amount,
  target: props.transaction.target,
  request: props.transaction.request ?? '',
  tags: props.transaction.tags,
  group: props.transaction.group.id
})

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
    tags: tags.map(tag => tag.id)
  }
  try {
    const response = (await apis.putTransactionDetail(id, transaction)).data
    const nextTransaction = {
      ...response,
      created_at: DateTime.fromISO(response.created_at),
      updated_at: DateTime.fromISO(response.updated_at)
    }
    emit('edited', nextTransaction)
  } catch {
    toast.error('入出金記録の修正に失敗しました')
    emit('edited', undefined)
  } finally {
    editedValue.value = {
      amount: props.transaction.amount,
      target: props.transaction.target ?? '',
      request: props.transaction.request,
      tags: props.transaction.tags,
      group: props.transaction.group.id
    }
  }
}
</script>

<template>
  <form class="mb-4 space-y-2">
    <div>年月日：{{ formatDate(transaction.created_at) }}</div>
    <div>
      取引額：
      <InputNumber
        v-model="editedValue.amount"
        class="mr-1"
        :min="1"
        placeholder="金額" />円
    </div>
    <div>
      取引相手：
      <InputText v-model="editedValue.target" placeholder="取引相手を入力" />
    </div>
    <div>
      取引グループ：
      <InputSelect
        v-model="editedValue.group"
        :options="groupStore.groupOptions"
        placeholder="グループを選択" />
    </div>
    <div>
      タグ：
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
