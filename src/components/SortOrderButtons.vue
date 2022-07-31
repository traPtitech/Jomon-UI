<script lang="ts" setup>
import { ArrowCircleUpIcon, ArrowCircleDownIcon } from '@heroicons/vue/outline'
import {
  ArrowCircleUpIcon as ArrowCircleUpIconSolid,
  ArrowCircleDownIcon as ArrowCircleDownIconSolid
} from '@heroicons/vue/solid'

// todo:クエリパラメータの仕様決まってから作る(created_atとamountを同時にorder指定できるのかどうかなど)
</script>

<template>
  <arrow-circle-down-icon-solid v-if="true" class="h-5 cursor-pointer" />
  <arrow-circle-down-icon v-else class="h-5 cursor-pointer" />
  <arrow-circle-up-icon-solid v-if="true" class="h-5 cursor-pointer" />
  <arrow-circle-up-icon v-else class="h-5 cursor-pointer" />
</template>
