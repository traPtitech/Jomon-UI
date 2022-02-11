<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRequestStore } from '../stores/request'
import StatusChip from './StatusChip.vue'
const requestStore = useRequestStore()
const { requests, dateFormatter } = storeToRefs(requestStore)
type Props = { index: number }
const props = defineProps<Props>()
</script>

<template>
  <router-link :to="'/requests/' + requests[props.index].id">
    <div class="flex justify-around hover:bg-gray-100">
      <div class="flex-1 text-center">
        <StatusChip :status="requests[props.index].status" />
      </div>
      <div class="flex-1 text-center">{{ requests[props.index].title }}</div>
      <div class="flex-1 text-center">
        {{ requests[props.index].created_by }}
      </div>
      <div class="flex-1 text-center">
        {{ dateFormatter(requests[props.index].created_at) }}
      </div>
      <div class="flex-1 text-center">{{ requests[props.index].amount }}円</div>
      <div class="flex-1 text-center">
        <span v-for="tag in requests[props.index].tags" :key="tag.id"
          >{{ tag.name }},</span
        >
      </div>
      <div class="flex-1 text-center">
        {{ requests[props.index].group.name }}
      </div>
    </div>
  </router-link>
</template>
