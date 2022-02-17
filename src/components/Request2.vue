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
    <div class="flex hover:bg-gray-100 pb-1">
      <div class="flex items-center">
        <StatusChip :status="requests[props.index].status" />
      </div>
      <div class="flex-grow">
        <div class="">{{ requests[props.index].title }}</div>
        <div class="">
          <span>グループ：{{ requests[props.index].group.name }}</span>
        </div>
        <div class="">
          <span
            v-for="tag in requests[props.index].tags"
            :key="tag.id"
            class="border border-solid border-black rounded mr-2"
            >{{ tag.name }}</span
          >
        </div>
      </div>
      <div class="text-center flex flex-col justify-between mr-4">
        <div class="">
          <span class="mr-4"
            >申請者：{{ requests[props.index].created_by }}</span
          >
          <span
            >申請日：{{ dateFormatter(requests[props.index].created_at) }}</span
          >
        </div>

        <div class="text-right text-4xl">
          <span class="">{{ requests[props.index].amount }}円</span>
        </div>
      </div>
    </div>
  </router-link>
</template>
