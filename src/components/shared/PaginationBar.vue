<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline'
import { computed } from 'vue'

import PageLink from './PageLink.vue'

type Props = {
  path: string
  currentPage: number
  totalPages: number
}

// sequence(3, 7) => [3, 4, 5, 6, 7]
const sequence = (start: number, end: number) => {
  return [...Array(end - start + 1).keys()].map(i => i + start)
}

const props = defineProps<Props>()

// P1: 001 002 003 004 005 006 007 008 009   -   left
// P2: 001 002 003 004 005 006 ... 099 100   -   left ... center
// P3: 001 002 ... 049 050 051 ... 099 100   -   left ... center ... right
// P4: 001 002 ... 095 096 097 098 099 100   -   left ... center

// 常に表示される
const left = computed(
  () =>
    props.totalPages <= 9
      ? sequence(1, props.totalPages) // P1
      : props.currentPage <= 5
      ? sequence(1, 6) // P2
      : sequence(1, 2) // P3, P4
)
// totalPages > 9 のとき、表示される
const center = computed(
  () =>
    props.currentPage <= 5
      ? sequence(props.totalPages - 1, props.totalPages) // P2
      : props.currentPage <= props.totalPages - 5
      ? sequence(props.currentPage - 1, props.currentPage + 1) // P3
      : sequence(props.totalPages - 5, props.totalPages) // P4
)
// totalPages > 9 && 5 < currentPage <= totalPages - 5 のとき、表示される
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
        <chevron-left-icon class="w-4" />Prev
      </router-link>

      <!-- Left -->
      <div class="flex">
        <page-link
          v-for="page in left"
          :key="page"
          class="not-last:mr-1"
          :page="page"
          :path="path"
          :selected="page === currentPage" />
      </div>

      <!-- Center -->
      <div v-if="totalPages > 9" class="flex">
        <span class="w-10 self-end pb-2">...</span>
        <page-link
          v-for="page in center"
          :key="page"
          class="not-last:mr-1"
          :page="page"
          :path="path"
          :selected="page === currentPage" />
      </div>

      <!-- Right -->
      <div
        v-if="
          totalPages > 9 && 5 < currentPage && currentPage <= totalPages - 5
        "
        class="flex">
        <span class="w-10 self-end pb-2">...</span>
        <page-link
          v-for="page in right"
          :key="page"
          class="not-last:mr-1"
          :page="page"
          :path="path"
          :selected="page === currentPage" />
      </div>

      <!-- Next -->
      <router-link
        class="w-18 ml-4 flex items-center justify-center rounded hover:bg-gray-200"
        :class="currentPage === totalPages ? 'invisible' : ''"
        :to="`${path}?page=${currentPage + 1}`">
        Next<chevron-right-icon class="w-4" />
      </router-link>
    </div>
  </div>
</template>
