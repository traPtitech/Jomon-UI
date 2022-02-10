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
    date.split('-')[0] +
    '年' +
    date.split('-')[1] +
    '月' +
    date.split('-')[2].split('T')[0] +
    '日'
)
</script>

<template>
  <router-link :to="'/requests/' + props.request.id">
    <div class="flex justify-around hover:bg-gray-100">
      <div class="flex-1 text-center">{{ props.request.status }}</div>
      <div class="flex-1 text-center">{{ props.request.title }}</div>
      <div class="flex-1 text-center">
        {{ props.request.created_by }}
      </div>
      <div class="flex-1 text-center">
        {{ dateFormatter(props.request.created_at) }}
      </div>
      <div class="flex-1 text-center">{{ props.request.amount }}円</div>
      <div class="flex-1 text-center">
        <span v-for="tag in props.request.tags" :key="tag.id"
          >{{ tag.name }},</span
        >
      </div>
      <div class="flex-1 text-center">{{ props.request.group.name }}</div>
    </div>
  </router-link>
</template>
