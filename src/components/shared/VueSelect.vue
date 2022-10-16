<script lang="ts" setup>
import VueSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
</script>

<template>
  <VueSelect v-bind="$attrs">
    <template #no-options="{ search, searching, loading }">
      <div v-if="searching">
        <span> "{{ search }}" は見つかりませんでした </span>
      </div>
      <div v-else-if="loading">
        <span>読み込み中...</span>
      </div>
      <div v-else>
        <span>選択肢がありません</span>
      </div>
    </template>
  </VueSelect>
</template>

<style>
.vs--multiple .vs__selected {
  background-color: #e5e7eb; /*gray-200*/
  border: none;
}
.vs__dropdown-option--selected::before {
  color: green;
  content: '\2713';
}
.vs__dropdown-option--deselect {
  background-color: #e5e7eb; /*gray-400*/
  color: #1f1f1f; /*dark-500*/
}
</style>
