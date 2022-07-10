<script lang="ts" setup>
import { ref } from 'vue'

import Button from './shared/Button.vue'
import FixButton from './shared/FixButton.vue'
import { useGroupStore } from '/@/stores/group'

const groupStore = useGroupStore()
const fixMode = ref('')
const fixedValue = ref({
  name: groupStore.group.name,
  description: groupStore.group.description,
  budget: groupStore.group.budget
})
function changeFixMode(kind: 'name' | 'description' | '') {
  if (kind !== '') {
    fixMode.value = kind
  } else {
    groupStore.putGroup(groupStore.group.id, fixedValue.value)
    fixMode.value = ''
  }
}
</script>

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
