<script lang="ts" setup>
import { ArrowCircleUpIcon, ArrowCircleDownIcon } from '@heroicons/vue/outline'
import {
  ArrowCircleUpIcon as ArrowCircleUpIconSolid,
  ArrowCircleDownIcon as ArrowCircleDownIconSolid
} from '@heroicons/vue/solid'
</script>

<template>
  <ArrowCircleDownIconSolid v-if="true" class="h-5 cursor-pointer" />
  <ArrowCircleDownIcon v-else class="h-5 cursor-pointer" />
  <ArrowCircleUpIconSolid v-if="true" class="h-5 cursor-pointer" />
  <ArrowCircleUpIcon v-else class="h-5 cursor-pointer" />
</template>
