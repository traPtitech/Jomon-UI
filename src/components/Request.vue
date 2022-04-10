<script lang="ts" setup>
import type { Request } from '../lib/apis'
import { formatDate } from '../utiles/date'
import StatusChip from './shared/StatusChip.vue'
import Tags from './shared/Tags.vue'

type Props = { request: Request }
const props = defineProps<Props>()
</script>

<template>
  <router-link :to="'/requests/' + request.id">
    <div class="flex hover:bg-gray-100 pb-1">
      <div class="mt-auto mb-auto mr-2 ml-1">
        <StatusChip :status="request.status!" />
      </div>
      <div class="flex-grow">
        <div class="text-xl">{{ request.title }}</div>
        <div class="mt-2">
          <Tags :tags="request.tags!" />
        </div>
      </div>
      <div class="text-center flex flex-col justify-between mr-4">
        <div class="">
          <span class="mr-4">グループ：{{ request.group.name }}</span>
          <span class="mr-4">申請者：{{ request.created_by }}</span>
          <span>申請日：{{ formatDate(request.created_at) }}</span>
        </div>
        <div class="text-right text-4xl">
          <span class="">{{ request.amount }}円</span>
        </div>
      </div>
    </div>
  </router-link>
</template>
