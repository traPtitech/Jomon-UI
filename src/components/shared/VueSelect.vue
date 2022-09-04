<script lang="ts" setup>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
</script>

<template>
  <v-select v-bind="$attrs">
    <template #no-options="{ search, searching, loading }">
      <div v-if="searching">
        <span>
          "{{ search }}"に一致する{{ $attrs.placeholder }}は見つかりませんでした
        </span>
      </div>
      <div v-else-if="loading">
        <span>読み込み中...</span>
      </div>
      <div v-else>
        <span>選択肢がありません</span>
      </div>
    </template>
  </v-select>
</template>

<style>
.v-select .vs__selected {
  background-color: #e5e7eb; /*gray-200*/
  border-color: #d1d5db;
}
</style>
