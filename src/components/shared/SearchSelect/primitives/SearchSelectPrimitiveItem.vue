<script setup lang="ts">
// SearchSelectPrimitiveItem
// Binds to api.getItemProps({ item })
</script>

<template>
  <li
    class="relative cursor-default py-2 pr-4 pl-10 text-gray-900 select-none data-highlighted:bg-blue-100 data-highlighted:text-blue-900 sm:text-sm">
    <slot />
  </li>
</template>
