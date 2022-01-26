<script lang="ts" setup>
import { computed } from 'vue'

type Request = {
  id: string
  status: string
  created_at: string
  updated_at: string
  created_by: string
  amount: number
  title: string
  content: string
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
}
type Props = { request: Request }
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
  <router-link :to="'/requests/' + props.request.id">
    <div class="flex justify-around">
      <div class="flex-1 text-center">{{ props.request.status }}</div>
      <div class="flex-1 text-center">{{ props.request.title }}</div>
      <div class="flex-1 text-center">
        {{ props.request.created_by }}
      </div>
      <div class="flex-1 text-center">
        {{ dateFormatter(props.request.created_at) }}
      </div>
      <div class="flex-1 text-center">{{ props.request.amount }}</div>
    </div>
  </router-link>
</template>
