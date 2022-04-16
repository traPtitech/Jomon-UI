<script lang="ts" setup>
import { LinkIcon } from '@heroicons/vue/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useTransactionStore } from '../stores/transaction'

const formatDate = (date: string) => {
  return (
    date.split('-')[0] +
    '年' +
    date.split('-')[1] +
    '月' +
    date.split('-')[2].split('T')[0] +
    '日'
  )
}

const transactionStore = useTransactionStore()
const { transactions } = storeToRefs(transactionStore)
type Props = { index: number }
const props = defineProps<Props>()
const flag = ref(false)
function handleMouseOver() {
  flag.value = true
}
function handleMouseLeave() {
  flag.value = false
}
</script>

<template>
  <div class="flex">
    <router-link
      v-if="transactions[props.index].request !== ''"
      class="flex w-3/5"
      :to="'requests/' + transactions[props.index].request">
      <div class="text-center text-sky-500 w-1/4">
        {{ formatDate(transactions[props.index].created_at) }}
      </div>
      <div class="text-center text-sky-500 w-1/4">
        {{ transactions[props.index].amount }}
      </div>
      <div class="text-center text-sky-500 w-1/4">
        {{ transactions[props.index].target }}
      </div>
      <div class="text-center text-sky-500 w-1/4">
        {{ transactions[props.index].group.description }}
      </div>
    </router-link>
    <div v-else class="flex w-3/5">
      <div class="text-center w-1/4">
        {{ formatDate(transactions[props.index].created_at) }}
      </div>
      <div class="text-center w-1/4">
        {{ transactions[props.index].amount }}
      </div>
      <div class="text-center w-1/4">
        {{ transactions[props.index].target }}
      </div>
      <div class="text-center w-1/4">
        {{ transactions[props.index].group.description }}
      </div>
    </div>
    <div
      class="pl-8 w-2/5 relative"
      @mouseleave="handleMouseLeave"
      @mouseover="handleMouseOver">
      <div v-if="flag" class="bg-gray-200 top-6 w-3/4 z-1 absolute">
        <span
          v-for="tag in transactions[props.index].tags"
          :key="tag.id"
          class="border border-solid border-black rounded mr-3 inline-block">
          {{ 'desc' }}&nbsp;&nbsp;
        </span>
      </div>
      <span v-if="transactions[props.index].tags.length <= 3">
        <span
          v-for="tag in transactions[props.index].tags"
          :key="tag.id"
          class="border border-solid border-black rounded mr-3 max-w-2/7 truncate inline-block">
          {{ 'desc' }}&nbsp;&nbsp;
        </span>
      </span>
      <span v-else>
        <span
          v-for="n in 3"
          :key="n"
          class="border border-solid border-black rounded mr-3 max-w-2/7 truncate inline-block">
          {{ 'desc' }}
        </span>
        <span>...</span>
      </span>
      <router-link
        class="h-5 ml-2 w-5 inline-block"
        :to="'/transactions/' + transactions[props.index].id">
        <LinkIcon />
      </router-link>
    </div>
  </div>
</template>
