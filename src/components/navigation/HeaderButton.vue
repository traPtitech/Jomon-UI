<script lang="ts" setup>
interface Props {
  isHere: boolean
  path: string
  text: string
}

const props = defineProps<Props>()
</script>

<template>
  <router-link 
    :class="props.isHere ? 'cursor-default' : ''"
    :to="props.path"
    :aria-current="props.isHere ? 'page' : undefined"
    tabindex="0">
    <div
      class="rounded-3xl p-2"
      :class="props.isHere ? 'bg-hover-primary' : 'hover:bg-hover-primary'">
      <span>{{ props.text }}</span>
    </div>
  </router-link>
</template>
