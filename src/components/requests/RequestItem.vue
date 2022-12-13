<script lang="ts" setup>
import type { Request } from '/@/stores/request'

import { formatDate } from '/@/lib/date'

import StatusChip from '/@/components/shared/StatusChip.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'

interface Props {
  request: Request
}

const props = defineProps<Props>()

const formattedDate = formatDate(props.request.created_at)
</script>

<template>
  <router-link class="flex p-2" :to="'/requests/' + request.id">
    <div class="mx-2 flex items-center justify-center">
      <StatusChip :status="request.status" />
    </div>
    <div class="flex-grow">
      <span class="text-xl">{{ request.title }}</span>
      <div class="mt-2">
        <TagsGroup :tags="request.tags" />
      </div>
    </div>
    <div>
      <div class="flex gap-4">
        <span>グループ：{{ request.group.name }}</span>
        <span>申請者：{{ request.created_by }}</span>
        <span>申請日：{{ formattedDate }}</span>
      </div>
      <div class="text-right text-3xl">{{ request.amount }}円</div>
    </div>
  </router-link>
</template>
