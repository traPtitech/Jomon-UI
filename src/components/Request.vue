<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useRequestStore } from '../stores/request'
import StatusChip from './shared/StatusChip.vue'
import Tags from './shared/Tags.vue'

const requestStore = useRequestStore()
const { requests, dateFormatter } = storeToRefs(requestStore)
type Props = { index: number }
const props = defineProps<Props>()
</script>

<template>
  <router-link :to="'/requests/' + requests[props.index].id">
    <div class="flex hover:bg-gray-100 pb-1">
      <div class="mt-auto mb-auto mr-2 ml-1">
        <StatusChip :status="requests[props.index].status" />
      </div>
      <div class="flex-grow">
        <div class="text-xl">{{ requests[props.index].title }}</div>
        <div class="mt-2">
          <Tags :tags="requests[props.index].tags" />
        </div>
      </div>
      <div class="text-center flex flex-col justify-between mr-4">
        <div class="">
          <span class="mr-4"
            >グループ：{{ requests[props.index].group.name }}</span
          >
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
