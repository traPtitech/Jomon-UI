<script lang="ts" setup></script>

<template>
  詳細：
  <div v-if="!(fixMode === 'description')" class="flex items-start">
    <p class="pl-1 h-32 w-200 border border-gray-300 overflow-y-scroll">
      {{ groupStore.group?.description }}
    </p>
    <FixButton @click="changeFixMode('description')" />
  </div>
  <div v-if="fixMode === 'description'">
    <textarea
      v-model="fixedValue.description"
      class="resize-none w-200 h-32 p-1"
      placeholder="詳細" />
    <Button
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="changeFixMode('')">
      完了
    </Button>
  </div>
</template>
