<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useGroupStore } from '../stores/group'

const groupStore = useGroupStore()
const { groups } = storeToRefs(groupStore)
type Props = { index: number }
const props = defineProps<Props>()
</script>

<template>
  <router-link :to="'/groups/' + groups[props.index].id">
    <div class="flex justify-around items-center hover:bg-gray-100">
      <div class="flex-1 text-center">{{ groups[props.index].name }}</div>
      <div class="flex-1 text-center">
        {{ groups[props.index].id }}
      </div>
      <div class="flex-1 text-center">
        {{ groups[props.index].description }}
      </div>
      <div class="flex-1 text-center">
        {{ groups[props.index].budget }}
      </div>
    </div>
  </router-link>
</template>
