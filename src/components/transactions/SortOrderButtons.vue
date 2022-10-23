<script lang="ts" setup>
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon
} from '@heroicons/vue/24/outline'
import {
  ArrowDownCircleIcon as ArrowDownCircleIconSolid,
  ArrowUpCircleIcon as ArrowUpCircleIconSolid
} from '@heroicons/vue/24/solid'

type Sort = 'asc' | 'desc' | 'none'

interface Props {
  sort: Sort
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex items-center">
    <ArrowUpCircleIconSolid
      v-if="props.sort === 'asc'"
      class="h-5 cursor-pointer" />
    <ArrowUpCircleIcon v-else class="h-5 cursor-pointer" />
    <ArrowDownCircleIconSolid
      v-if="props.sort === 'desc'"
      class="h-5 cursor-pointer" />
    <ArrowDownCircleIcon v-else class="h-5 cursor-pointer" />
  </div>
</template>
