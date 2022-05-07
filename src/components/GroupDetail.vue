<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import Button from './shared/Button.vue'
import FixButton from './shared/FixButton.vue'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

const groupStore = useGroupStore()
const fixMode = ref('')
const putGroupRequest = {
  name: groupStore.group.name,
  description: groupStore.group.description,
  budget: groupStore.group.budget
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
          <FixButton class="mr-2" @click="() => (fixMode = 'name')">
            <!--todo:権限-->
          </FixButton>
        </div>
        <div v-if="fixMode === 'name'">
          <input
            v-model="putGroupRequest.name"
            class="border boder- w-100 p-1 rounded"
            placeholder="グループ名" />
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="() => (fixMode = '')">
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
          <FixButton @click="() => (fixMode = 'description')"> </FixButton>
        </div>
        <div v-if="fixMode === 'description'">
          <textarea
            v-model="putGroupRequest.description"
            class="resize-none w-200 h-20 p-1"
            placeholder="詳細" />
          <Button
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click.stop="() => (fixMode = '')">
            完了
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
