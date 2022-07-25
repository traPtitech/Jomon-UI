<script lang="ts" setup>
import StatusChip from './shared/StatusChip.vue'
import Tags from './shared/Tags.vue'
import type { Request } from '/@/lib/apis'
import { formatDate } from '/@/lib/date'

interface Props {
  request: Request
}

const props = defineProps<Props>()
const formattedDate = formatDate(props.request.created_at)
</script>

<template>
  <router-link :to="'/requests/' + request.id">
    <div class="flex p-1 hover:bg-zinc-100">
      <div class="flex items-center justify-center">
        <status-chip :status="request.status" />
      </div>
      <div class="flex-grow">
        <span class="text-xl">{{ request.title }}</span>
        <div class="mt-2">
          <tags :tags="request.tags" />
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex gap-4">
          <span>グループ：{{ request.group.name }}</span>
          <span>申請者：{{ request.created_by }}</span>
          <span> 申請日：{{ formattedDate }} </span>
        </div>
        <div class="text-right text-3xl">{{ request.amount }}円</div>
      </div>
    </div>
  </router-link>
</template>
