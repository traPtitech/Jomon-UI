<script setup lang="ts">
// SearchSelectPrimitiveInput
// Accepts all attributes (v-bind="$attrs")
// Typically used with api.inputProps
</script>

<template>
  <input
    class="peer h-12 w-full rounded-md border border-gray-300 bg-white px-3 pt-6 pb-2 text-left text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
    @focus="($event.target as HTMLInputElement).select()" />
</template>
