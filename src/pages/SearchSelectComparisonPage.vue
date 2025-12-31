<script setup lang="ts">
import { ref } from 'vue'

import SearchMultiSelect from '@/components/shared/SearchSelect/SearchMultiSelect.vue'
import SearchMultiSelectHeadless from '@/components/shared/SearchSelect/SearchMultiSelectHeadless.vue'
import SearchMultiSelectReka from '@/components/shared/SearchSelect/SearchMultiSelectReka.vue'
import SearchSelect from '@/components/shared/SearchSelect/SearchSelect.vue'
import SearchSelectHeadless from '@/components/shared/SearchSelect/SearchSelectHeadless.vue'
import SearchSelectReka from '@/components/shared/SearchSelect/SearchSelectReka.vue'
import type { Option } from '@/components/shared/SearchSelect/types'

const options: Option<string>[] = [
  { label: 'Option 1', key: 'opt1' },
  { label: 'Option 2', key: 'opt2' },
  { label: 'Option 3', key: 'opt3' },
  { label: 'Option 4', key: 'opt4', disabled: true },
  { label: 'Option 5', key: 'opt5' },
]

const singleZag = ref<string | null>(null)
const singleHeadless = ref<string | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const singleReka = ref<any>(null)

const multiZag = ref<string[]>([])
const multiHeadless = ref<string[]>([])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const multiReka = ref<any>([])
</script>

<template>
  <div class="container mx-auto space-y-8 p-8">
    <h1 class="mb-4 text-2xl font-bold">
      SearchSelect Implementation Comparison
    </h1>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- Zag (Current) -->
      <div class="space-y-4 rounded border bg-gray-50 p-4">
        <h2 class="text-xl font-semibold">Zag (Current)</h2>

        <div class="space-y-2">
          <h3 class="font-medium">Single Select</h3>
          <SearchSelect
            v-model="singleZag"
            :options="options"
            label="Select Item" />
          <div class="text-xs text-gray-500">Value: {{ singleZag }}</div>
        </div>

        <div class="space-y-2">
          <h3 class="font-medium">Multi Select</h3>
          <SearchMultiSelect
            v-model="multiZag"
            :options="options"
            label="Select Items" />
          <div class="text-xs text-gray-500">Value: {{ multiZag }}</div>
        </div>
      </div>

      <!-- Headless UI -->
      <div class="space-y-4 rounded border bg-gray-50 p-4">
        <h2 class="text-xl font-semibold">Headless UI</h2>

        <div class="space-y-2">
          <h3 class="font-medium">Single Select</h3>
          <SearchSelectHeadless
            v-model="singleHeadless"
            :options="options"
            label="Select Item" />
          <div class="text-xs text-gray-500">Value: {{ singleHeadless }}</div>
        </div>

        <div class="space-y-2">
          <h3 class="font-medium">Multi Select</h3>
          <SearchMultiSelectHeadless
            v-model="multiHeadless"
            :options="options"
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
            :options="options"
            label="Select Item" />
          <div class="text-xs text-gray-500">Value: {{ singleReka }}</div>
        </div>

        <div class="space-y-2">
          <h3 class="font-medium">Multi Select</h3>
          <SearchMultiSelectReka
            v-model="multiReka"
            :options="options"
            label="Select Items" />
          <div class="text-xs text-gray-500">Value: {{ multiReka }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
