<script lang="ts" setup>
import { computed } from 'vue'

import { RouterLink } from 'vue-router'

import { formatDate } from '@/lib/date'

import StatusChip from '@/components/shared/StatusChip.vue'
import TagsPartition from '@/components/shared/TagsPartition.vue'
import UserIcon from '@/components/shared/UserIcon.vue'
import type { Application } from '@/features/application/entities'
import { useUserStore } from '@/features/user/store'

interface Props {
  application: Application
}

const props = defineProps<Props>()

const { getUserName, getUserNameWithFallback } = useUserStore()

const formattedDate = formatDate(props.application.createdAt)

const totalAmount = computed(() =>
  props.application.targets.reduce((a, target) => a + target.amount, 0)
)
</script>

<template>
  <RouterLink
    class="flex gap-2 px-3 py-4 sm:gap-5 sm:px-6"
    :to="'/applications/' + application.id">
    <div class="flex items-start justify-center">
      <StatusChip :status="application.status" />
    </div>
    <div class="flex flex-grow flex-wrap">
      <div class="flex flex-grow flex-col gap-2">
        <span class="text-xl">{{ application.title }}</span>
        <TagsPartition :tags="application.tags" />
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-wrap items-center justify-end gap-x-4">
          <div class="flex items-center gap-1">
            <UserIcon
              class="max-w-7"
              :name="getUserName(application.createdBy)" />
            <span>{{ getUserNameWithFallback(application.createdBy) }}</span>
          </div>
          <span v-if="application.partition">
            {{ application.partition.name }}
          </span>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="text-right font-sans text-2xl font-bold">
          {{ totalAmount }}円
        </div>
      </div>
    </div>
  </RouterLink>
</template>
