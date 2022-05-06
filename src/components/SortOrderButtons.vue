<script lang="ts" setup>
import { ArrowCircleUpIcon, ArrowCircleDownIcon } from '@heroicons/vue/outline'
import {
  ArrowCircleUpIcon as ArrowCircleUpIconSolid,
  ArrowCircleDownIcon as ArrowCircleDownIconSolid
} from '@heroicons/vue/solid'
</script>

<template>
  <ArrowCircleDownIconSolid v-if="true" class="cursor-pointer h-5" />
  <ArrowCircleDownIcon v-else class="cursor-pointer h-5" />
  <ArrowCircleUpIconSolid v-if="true" class="cursor-pointer h-5" />
  <ArrowCircleUpIcon v-else class="cursor-pointer h-5" />
</template>
