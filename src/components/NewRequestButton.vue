<script lang="ts" setup>
import { DocumentAddIcon } from '@heroicons/vue/outline'
</script>
<template>
  <div class="flex items-center">
    <DocumentAddIcon class="h-6" />
    <router-link to="/requests/new"><div>新規申請</div></router-link>
  </div>
</template>
