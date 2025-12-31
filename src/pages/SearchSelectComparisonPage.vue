<script setup lang="ts">
import { ref } from 'vue'

import SearchMultiSelectHeadless from '@/components/shared/SearchSelectHeadless/SearchMultiSelectHeadless.vue'
import SearchSelectHeadless from '@/components/shared/SearchSelectHeadless/SearchSelectHeadless.vue'
import type { Option } from '@/components/shared/SearchSelectHeadless/types'
import SearchMultiSelectReka from '@/components/shared/SearchSelectReka/SearchMultiSelect.vue'
import SearchSelectReka from '@/components/shared/SearchSelectReka/SearchSelect.vue'
import type { SearchSelectOption as RekaOption } from '@/components/shared/SearchSelectReka/composables/useSearchSelect'

const optionsReka: RekaOption<string>[] = [
  { label: 'Option 1', key: 'opt1' },
  { label: 'Option 2', key: 'opt2' },
  { label: 'Option 3', key: 'opt3' },
  { label: 'Option 4', key: 'opt4', disabled: true },
  { label: 'Option 5', key: 'opt5' },
]
const optionsHeadless: Option<string>[] = [
  { label: 'Option 1', key: 'opt1' },
  { label: 'Option 2', key: 'opt2' },
  { label: 'Option 3', key: 'opt3' },
  { label: 'Option 4', key: 'opt4', disabled: true },
  { label: 'Option 5', key: 'opt5' },
]

const singleHeadless = ref<string | null>(null)

const singleReka = ref<string | null>(null)

const multiHeadless = ref<string[]>([])

const multiReka = ref<string[]>([])
</script>

<template>
  <div class="container mx-auto space-y-8 p-8">
    <h1 class="mb-4 text-2xl font-bold">
      SearchSelect Implementation Comparison
    </h1>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- Headless UI -->
      <div class="space-y-4 rounded border bg-gray-50 p-4">
        <h2 class="text-xl font-semibold">Headless UI</h2>

        <div class="space-y-2">
          <h3 class="font-medium">Single Select</h3>
          <SearchSelectHeadless
            v-model="singleHeadless"
            :options="optionsHeadless"
            label="Select Item" />
          <div class="text-xs text-gray-500">Value: {{ singleHeadless }}</div>
        </div>

        <div class="space-y-2">
          <h3 class="font-medium">Multi Select</h3>
          <SearchMultiSelectHeadless
            v-model="multiHeadless"
            :options="optionsHeadless"
            label="Select Items" />
          <div class="text-xs text-gray-500">Value: {{ multiHeadless }}</div>
        </div>
      </div>

      <!-- Reka UI -->
      <div class="space-y-4 rounded border bg-gray-50 p-4">
        <h2 class="text-xl font-semibold">Reka UI</h2>

        <div class="space-y-2">
          <h3 class="font-medium">Single Select</h3>
          <SearchSelectReka
            v-model="singleReka"
            :options="optionsReka"
            label="Select Item" />
          <div class="text-xs text-gray-500">Value: {{ singleReka }}</div>
        </div>

        <div class="space-y-2">
          <h3 class="font-medium">Multi Select</h3>
          <SearchMultiSelectReka
            v-model="multiReka"
            :options="optionsReka"
            label="Select Items" />
          <div class="text-xs text-gray-500">Value: {{ multiReka }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
