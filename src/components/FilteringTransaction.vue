<script lang="ts" setup>
import { ref } from 'vue'

import { SearchIcon } from '@heroicons/vue/solid'
import { XIcon } from '@heroicons/vue/outline'
</script>
<template>
  <dev class="min-w-80 min-h-80 border-3">
    <dev class="flex justify-evenly">
      <SearchIcon class="h-6 border-2 border-gray-500" />
      <XIcon class="h-6 border-2 border-gray-500" />
    </dev>
    <dev class="flex justify-evenly">
      <button>新しい順</button>
      <button>古い順</button>
      <button>タイトル昇順</button>
      <button>タイトル降順</button>
    </dev>
    <input placeholder="年度" />
    <div class="flex justify-around">
      <input placeholder="xxxx-xx-xx" />
      <span>～</span>
      <input placeholder="xxxx-xx-xx" />
    </div>
    <div>取引相手</div>
    <div>タグ</div>
    <div>グループ</div>
  </dev>
</template>
