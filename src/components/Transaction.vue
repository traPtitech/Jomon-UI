<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '../stores/transaction'
const transactionStore = useTransactionStore()
const { transactions, dateFormatter } = storeToRefs(transactionStore)
type Props = { index: number }
const props = defineProps<Props>()
</script>

<template>
  <dev class="flex">
    <dev class="w-1/6 text-center">
      {{ dateFormatter(transactions[props.index].created_at) }}
    </dev>
    <dev class="w-1/6 text-center">{{ transactions[props.index].amount }}</dev>
    <dev class="w-1/6 text-center">{{ transactions[props.index].target }}</dev>
    <dev class="w-1/6 text-center">
      {{ transactions[props.index].group.description }}
    </dev>
    <dev class="w-1/3 text-center">
      <!-- TODO: ,最後消す -->
      <dev
        v-for="tag in transactions[props.index].tags"
        :key="tag.id"
        class="inline-block"
      >
        {{ tag.description }},&nbsp;&nbsp;
      </dev>
    </dev>
  </dev>
</template>
