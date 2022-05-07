<script lang="ts" setup>
import { ref } from 'vue'

import Button from './shared/Button.vue'
import FixButton from './shared/FixButton.vue'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

const groupStore = useGroupStore()
const fixMode = ref('')
const fixedValue = ref({
  name: groupStore.group.name,
  description: groupStore.group.description,
  budget: groupStore.group.budget
})
function changeFixMode(kind: string) {
  //todo:金額のバリデーション
  groupStore.putGroup(groupStore.group.id, fixedValue.value)
  switch (kind) {
    case 'name':
      if (fixMode.value === 'name') {
        fixMode.value = ''
      } else {
        fixMode.value = 'name'
      }
      break
    case 'description':
      if (fixMode.value === 'description') {
        fixMode.value = ''
      } else {
        fixMode.value = 'description'
      }
      break
  }
}
</script>

<template>
  <div class="ml-12 pt-6">
    <div>
      <div class="flex items-center">
        <div v-if="!(fixMode === 'name')" class="flex">
          <h1 class="text-3xl">
            {{ groupStore.group.name }}
          </h1>
          <FixButton class="mr-2" @click="changeFixMode('name')" />
          <!--todo:権限-->
        </div>
        <div v-if="fixMode === 'name'">
          <input
            v-model="fixedValue.name"
            class="border boder- w-100 p-1 rounded"
            placeholder="グループ名" />
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeFixMode('name')">
            完了
          </Button>
        </div>
      </div>
      <div class="mt-4 flex">
        詳細：
        <div v-if="!(fixMode === 'description')" class="flex items-start">
          <div class="h-32 w-200 border border-gray-300 overflow-y-scroll">
            {{ groupStore.group?.description }}
          </div>
          <FixButton @click="changeFixMode('description')" />
        </div>
        <div v-if="fixMode === 'description'">
          <textarea
            v-model="fixedValue.description"
            class="resize-none w-200 h-20 p-1"
            placeholder="詳細" />
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="changeFixMode('description')">
            完了
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
