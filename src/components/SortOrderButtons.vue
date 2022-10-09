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
  <arrow-down-circle-icon-solid
    v-if="props.sort === 'desc'"
    class="h-5 cursor-pointer" />
  <arrow-down-circle-icon v-else class="h-5 cursor-pointer" />
  <arrow-up-circle-icon-solid
    v-if="props.sort === 'asc'"
    class="h-5 cursor-pointer" />
  <arrow-up-circle-icon v-else class="h-5 cursor-pointer" />
</template>
