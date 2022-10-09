<script lang="ts" setup>
import StatusChip from './shared/StatusChip.vue'
import TagGroup from './shared/TagsGroup.vue'
import type { Request } from '/@/lib/apis'
import { formatDate } from '/@/lib/date'

interface Props {
  request: Request
}

const props = defineProps<Props>()

const formattedDate = formatDate(props.request.created_at)
</script>

<template>
  <router-link class="flex p-2" :to="'/requests/' + request.id">
    <div class="mx-2 flex items-center justify-center">
      <status-chip :status="request.status" />
    </div>
    <div class="flex-grow">
      <div class="flex flex-col justify-between md:flex-row">
        <p class="flex-grow text-xl">{{ request.title }}</p>
        <div class="flex md:gap-4">
          <span>申請者：{{ request.created_by }}</span>
          <span class="hidden md:inline">
            グループ：{{ request.group.name }}
          </span>
          <span class="hidden md:inline">申請日：{{ formattedDate }}</span>
        </div>
      </div>
      <div class="flex flex-col justify-between md:flex-row md:items-center">
        <tag-group class="hidden md:inline" :tags="request.tags" />
        <p class="text-right text-2xl md:text-3xl">{{ request.amount }}円</p>
      </div>
    </div>
  </router-link>
</template>
