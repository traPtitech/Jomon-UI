<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useUserStore } from '/@/stores/user'

import { formatDate } from '/@/lib/date'

import StatusChip from '/@/components/shared/StatusChip.vue'
import TagsGroup from '/@/components/shared/TagsGroup.vue'
import type { Request } from '/@/features/request/model'
import UserIcon from '/@/components/shared/UserIcon.vue'

interface Props {
  request: Request
}

const props = defineProps<Props>()

const userStore = useUserStore()
const { userMap } = storeToRefs(userStore)

const formattedDate = formatDate(props.request.createdAt)

const totalAmount = computed(
  () => props.request.targets.reduce((a, target) => a + target.amount, 0) ?? 0
)
</script>

<template>
  <RouterLink class="flex px-6 py-4" :to="'/requests/' + request.id">
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
        <UserIcon class="max-w-8" :name="userMap[request.created_by]" />
        <span>{{ userMap[request.created_by] }}</span>
        <span v-if="request.group"> {{ request.group.name }} </span>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="text-right text-3xl">{{ totalAmount }}円</div>
    </div>
  </RouterLink>
</template>
