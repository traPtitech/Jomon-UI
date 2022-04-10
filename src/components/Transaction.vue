<script lang="ts" setup>
import { LinkIcon } from '@heroicons/vue/outline'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useTransactionStore } from '../stores/transaction'
import { formatDate } from '../utiles/date'
import Tags from './shared/Tags.vue'

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
      <div class="w-1/4 text-center text-sky-500">
        {{ formatDate(transactions[props.index].created_at!) }}
      </div>
      <div class="w-1/4 text-center text-sky-500">
        {{ transactions[props.index].amount }}
      </div>
      <div class="w-1/4 text-center text-sky-500">
        {{ transactions[props.index].target }}
      </div>
      <div class="w-1/4 text-center text-sky-500">
        {{ transactions[props.index].group!.description }}
      </div>
    </router-link>
    <div v-else class="flex w-3/5">
      <div class="w-1/4 text-center">
        {{ formatDate(transactions[props.index].created_at!) }}
      </div>
      <div class="w-1/4 text-center">
        {{ transactions[props.index].amount }}
      </div>
      <div class="w-1/4 text-center">
        {{ transactions[props.index].target }}
      </div>
      <div class="w-1/4 text-center">
        {{ transactions[props.index].group!.description }}
      </div>
    </div>
    <div
      class="w-2/5 pl-8 relative"
      @mouseleave="handleMouseLeave"
      @mouseover="handleMouseOver">
      <div v-if="flag" class="absolute top-6 w-3/4 bg-gray-200 z-1">
        <span
          v-for="tag in transactions[props.index].tags"
          :key="tag.id"
          class="inline-block border border-solid border-black rounded mr-3">
          {{ tag.name }}&nbsp;&nbsp;
        </span>
      </div>
      <span>
        <Tags :limit="3" :tags="transactions[props.index].tags!" />
      </span>
      <router-link
        class="ml-2 w-5 h-5 inline-block"
        :to="'/transactions/' + transactions[props.index].id">
        <LinkIcon />
      </router-link>
    </div>
  </div>
</template>
