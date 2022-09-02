<script lang="ts" setup>
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon
} from '@heroicons/vue/24/outline'
import { ArrowDownCircleIcon as ArrowDownCircleIconSolid } from '@heroicons/vue/24/solid'

// todo:クエリパラメータの仕様決まってから作る(created_atとamountを同時にorder指定できるのかどうかなど)
</script>

<template>
  <arrow-down-circle-icon-solid v-if="true" class="h-5 cursor-pointer" />
  <arrow-down-circle-icon v-else class="h-5 cursor-pointer" />
  <arrow-down-circle-icon-solid v-if="true" class="h-5 cursor-pointer" />
  <arrow-up-circle-icon v-else class="h-5 cursor-pointer" />
</template>
