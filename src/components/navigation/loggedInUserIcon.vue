<script lang="ts" setup>
import UserIcon from '@/components/shared/UserIcon.vue'
import { useUserStore } from '@/features/user/store'

const { me } = useUserStore()
</script>

<template>
  <UserIcon v-if="me !== undefined" class="w-10" :name="me.name" />
</template>
