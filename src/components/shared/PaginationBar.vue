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

// P1: 1 2 ... p-2 p-1 p p+1 p+2 ... last-1 last
// P2: 1 ... p ... last
// P3:

type PaginationType = number | '...'

const pages = computed(() => {
  const current = props.currentPage
  const last = props.totalPages

  const mergePages = (
    left: number[],
    center: number[],
    right: number[]
  ): PaginationType[] => {
    const leftOverlap = Math.max(...left) - Math.min(...center)
    const rightOverlap = Math.max(...center) - Math.min(...right)
    const leftMerge: PaginationType[] =
      leftOverlap >= -1
        ? [...left, ...center.slice(leftOverlap + 1)]
        : [...left, '...', ...center]
    const bothMerge: PaginationType[] =
      rightOverlap >= -1
        ? [...leftMerge, ...right.slice(rightOverlap + 1)]
        : [...leftMerge, '...', ...right]
    return bothMerge
  }

  return [
    mergePages(
      [1, 2].filter(page => 1 <= page && page <= last),
      [current - 2, current - 1, current, current + 1, current + 2].filter(
        page => 1 <= page && page <= last
      ),
      [last - 1, last].filter(page => 1 <= page && page <= last)
    ),
    mergePages([1], [current], [last])
  ]
})
</script>

<template>
  <div class="h-9 w-full text-center text-sm">
    <div class="mx-auto flex h-full w-min justify-center ring-0">
      <!-- Prev -->
      <router-link
        class="w-16 mr-4 flex items-center justify-center rounded hover:bg-hover-primary"
        :class="currentPage === 1 ? 'invisible' : ''"
        :to="`${path}?page=${currentPage - 1}`">
        <ChevronLeftIcon class="w-4" />Prev
      </router-link>

      <!-- Pagination -->
      <div class="hidden lg:flex gap-1">
        <div v-for="page in pages[0]" :key="page" class="flex">
          <PageLink
            v-if="typeof page === 'number'"
            class="h-full"
            :is-selected="page === currentPage"
            :page="page"
            :path="path" />
          <span v-else class="w-10 self-end pb-2">...</span>
        </div>
      </div>
      <div class="hidden md:max-lg:flex gap-1">
        <div v-for="page in pages[1]" :key="page" class="flex">
          <PageLink
            v-if="typeof page === 'number'"
            class="h-full"
            :is-selected="page === currentPage"
            :page="page"
            :path="path" />
          <span v-else class="w-10 self-end pb-2">...</span>
        </div>
      </div>

      <!-- Next -->
      <router-link
        class="w-16 ml-4 flex items-center justify-center rounded hover:bg-hover-primary"
        :class="currentPage === totalPages ? 'invisible' : ''"
        :to="`${path}?page=${currentPage + 1}`">
        Next<ChevronRightIcon class="w-4" />
      </router-link>
    </div>
  </div>
</template>
