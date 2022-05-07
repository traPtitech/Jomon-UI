<script lang="ts" setup>
import StatusChip from './shared/StatusChip.vue'
import Tags from './shared/Tags.vue'
import type { Request } from '/@/lib/apis'
import { formatDate } from '/@/utils/date'

type Props = { request: Request }

defineProps<Props>()
</script>

<template>
  <router-link :to="'/requests/' + request.id">
    <div class="flex p-1 hover:bg-zinc-100">
      <div class="flex justify-center items-center">
        <StatusChip :status="request.status" />
      </div>
      <div class="flex-grow">
        <span class="text-xl">{{ request.title }}</span>
        <div class="mt-2">
          <Tags :tags="request.tags" />
        </div>
      </div>
      <div class="flex flex-col">
        <div>
          <span class="mr-4">グループ：{{ request.group.name }}</span>
          <span class="mr-4">申請者：{{ request.created_by }}</span>
          <span>申請日：{{ formatDate(new Date(request.created_at)) }}</span>
        </div>
        <div class="text-right text-3xl">
          <span>{{ request.amount }}円</span>
        </div>
      </div>
    </div>
  </router-link>
</template>
