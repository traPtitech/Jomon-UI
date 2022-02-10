<script lang="ts" setup>
import { computed } from 'vue'

type Transaction = {
  id: string
  amount: number
  target: string
  tags: {
    id: string
    name: string
    description: string
    created_at: string
    updated_at: string
  }[]
  group: {
    id: string
    name: string
    description: string
    budget: number
    created_at: string
    updated_at: string
  }
  created_at: string
}
type Props = { transaction: Transaction }
const props = defineProps<Props>()
const dateFormatter = computed(
  () => (date: string) =>
    date.split('T')[0].split('-')[0] +
    '年' +
    date.split('T')[0].split('-')[1] +
    '月' +
    date.split('T')[0].split('-')[2] +
    '日'
)
</script>

<template>
  <router-link :to="'/transaction/' + props.transaction.id">
    <dev class="flex">
      <dev class="w-1/6 text-center">
        {{ dateFormatter(props.transaction.created_at) }}
      </dev>
      <dev class="w-1/6 text-center">{{ props.transaction.amount }}</dev>
      <dev class="w-1/6 text-center">{{ props.transaction.target }}</dev>
      <dev class="w-1/6 text-center">
        {{ props.transaction.group.description }}
      </dev>
      <dev class="w-1/3 text-center">
        <!-- TODO: ,最後消す -->
        <dev
          v-for="tag in props.transaction.tags"
          :key="tag.id"
          class="inline-block"
        >
          {{ tag.description }},&nbsp;&nbsp;
        </dev>
      </dev>
    </dev>
  </router-link>
</template>
