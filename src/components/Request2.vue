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
    <div
      class="
        flex
        hover:bg-gray-100
        border-b-2 border-solid border-black border-opacity-40
      "
    >
      <div class="flex items-center">
        <StatusChip :status="requests[props.index].status" />
      </div>
      <div class="flex-grow">
        <div class="">{{ requests[props.index].title }}</div>
        <div>
          <span class="mr-8"
            >申請者：{{ requests[props.index].created_by }}</span
          >
          <span class="">グループ：{{ requests[props.index].group.name }}</span>
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
          {{ dateFormatter(requests[props.index].created_at) }}
        </div>
        <div class="">{{ requests[props.index].amount }}円</div>
      </div>
    </div>
  </router-link>
</template>
