<script lang="ts" setup>
import { ref } from 'vue'

import { SearchIcon } from '@heroicons/vue/solid'
import { XIcon } from '@heroicons/vue/outline'
</script>
<template>
  <div class="text-center flex">
    <div class="w-3/20">年 月 日</div>
    <div class="w-3/20">取引額</div>
    <div class="w-3/20">取引相手</div>
    <div class="w-3/20">取引グループ</div>
    <div class="w-2/5">タグ</div>
  </div>
</template>
