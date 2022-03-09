<script lang="ts" setup>
import { LinkIcon } from '@heroicons/vue/outline'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useTransactionStore } from '../stores/transaction'

const transactionStore = useTransactionStore()
const { transactions, dateFormatter } = storeToRefs(transactionStore)
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
      :to="'requests/' + transactions[props.index].request"
    >
      <div class="w-1/4 text-center text-sky-500">
        {{ dateFormatter(transactions[props.index].created_at) }}
      </div>
      <div class="w-1/4 text-center text-sky-500">
        {{ transactions[props.index].amount }}
      </div>
      <div class="w-1/4 text-center text-sky-500">
        {{ transactions[props.index].target }}
      </div>
      <div class="w-1/4 text-center text-sky-500">
        {{ transactions[props.index].group.description }}
      </div>
    </router-link>
    <div v-else class="flex w-3/5">
      <div class="w-1/4 text-center">
        {{ dateFormatter(transactions[props.index].created_at) }}
      </div>
      <div class="w-1/4 text-center">
        {{ transactions[props.index].amount }}
      </div>
      <div class="w-1/4 text-center">
        {{ transactions[props.index].target }}
      </div>
      <div class="w-1/4 text-center">
        {{ transactions[props.index].group.description }}
      </div>
    </div>
    <div
      class="w-2/5 pl-8 relative"
      @mouseleave="handleMouseLeave"
      @mouseover="handleMouseOver"
    >
      <div v-if="flag" class="absolute top-6 w-3/4 bg-gray-200 z-1">
        <span
          v-for="tag in transactions[props.index].tags"
          :key="tag.id"
          class="inline-block border border-solid border-black rounded mr-3"
        >
          {{ tag.description }}&nbsp;&nbsp;
        </span>
      </div>
      <span v-if="transactions[props.index].tags.length <= 3">
        <span
          v-for="tag in transactions[props.index].tags"
          :key="tag.id"
          class="
            truncate
            inline-block
            max-w-2/7
            border border-solid border-black
            rounded
            mr-3
          "
        >
          {{ tag.description }}&nbsp;&nbsp;
        </span>
      </span>
      <span v-else>
        <span
          v-for="n in 3"
          :key="n"
          class="
            truncate
            inline-block
            max-w-2/7
            border border-solid border-black
            rounded
            mr-3
          "
        >
          {{ transactions[props.index].tags[n - 1].description }}
        </span>
        <span>...</span>
      </span>
      <router-link
        :to="'/transactions/' + transactions[props.index].id"
        class="ml-2 w-5 h-5 inline-block"
      >
        <LinkIcon />
      </router-link>
    </div>
  </div>
</template>
