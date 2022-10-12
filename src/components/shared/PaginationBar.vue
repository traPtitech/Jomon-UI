<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

import PageLink from './PageLink.vue'

interface Props {
  path: string
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()

// sequence(3, 7) => [3, 4, 5, 6, 7]
const sequence = (start: number, end: number) => {
  return [...Array(end - start + 1).keys()].map(i => i + start)
}

// P1: 001 002 003 004 005 006 007 008 009 010 011   -   left
// P2: 001 002 003 004 005 006 007 008 ... 099 100   -   left ... center
// P3: 001 002 ... 048 049 050 051 052 ... 099 100   -   left ... center ... right
// P4: 001 002 ... 093 094 095 096 097 098 099 100   -   left ... center

// 常に表示される
const left = computed(
  () =>
    props.totalPages <= 11
      ? sequence(1, props.totalPages) // P1
      : props.currentPage <= 6
      ? sequence(1, 8) // P2
      : sequence(1, 2) // P3, P4
)
// totalPages > 11 のとき、表示される
const center = computed(
  () =>
    props.currentPage <= 6
      ? sequence(props.totalPages - 1, props.totalPages) // P2
      : props.currentPage <= props.totalPages - 6
      ? sequence(props.currentPage - 2, props.currentPage + 2) // P3
      : sequence(props.totalPages - 7, props.totalPages) // P4
)
// totalPages > 11 && 6 < currentPage <= totalPages - 6 のとき、表示される
const right = computed(
  () => sequence(props.totalPages - 1, props.totalPages) // P3
)
</script>

<template>
  <div class="h-9 w-full text-center text-sm">
    <div class="mx-auto flex h-full w-min justify-center ring-0">
      <!-- Prev -->
      <router-link
        class="w-18 mr-4 flex items-center justify-center rounded hover:bg-gray-200"
        :class="currentPage === 1 ? 'invisible' : ''"
        :to="`${path}?page=${currentPage - 1}`">
        <ChevronLeftIcon class="w-4" />Prev
      </router-link>

      <!-- Left -->
      <div class="flex">
        <PageLink
          v-for="page in left"
          :key="page"
          class="not-last:mr-1"
          :is-selected="page === currentPage"
          :page="page"
          :path="path" />
      </div>

      <!-- Center -->
      <div v-if="totalPages > 11" class="flex">
        <span class="w-10 self-end pb-2">...</span>
        <PageLink
          v-for="page in center"
          :key="page"
          class="not-last:mr-1"
          :is-selected="page === currentPage"
          :page="page"
          :path="path" />
      </div>

      <!-- Right -->
      <div
        v-if="
          totalPages > 11 && 6 < currentPage && currentPage <= totalPages - 6
        "
        class="flex">
        <span class="w-10 self-end pb-2">...</span>
        <PageLink
          v-for="page in right"
          :key="page"
          class="not-last:mr-1"
          :is-selected="page === currentPage"
          :page="page"
          :path="path" />
      </div>

      <!-- Next -->
      <router-link
        class="w-18 ml-4 flex items-center justify-center rounded hover:bg-gray-200"
        :class="currentPage === totalPages ? 'invisible' : ''"
        :to="`${path}?page=${currentPage + 1}`">
        Next<ChevronRightIcon class="w-4" />
      </router-link>
    </div>
  </div>
</template>
