<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import SimpleButton from '../shared/SimpleButton.vue'
import GroupBudget from './GroupBudget.vue'
import GroupDescription from './GroupDescription.vue'
import FixButton from '/@/components/shared/FixButton.vue'
import apis from '/@/lib/apis'
import type { Group, PostGroup } from '/@/lib/apis'
import { useGroupStore } from '/@/stores/group'

export type FixMode = 'name' | 'description' | 'budget' | ''

interface Props {
  group: Group
}

const props = defineProps<Props>()
const groupStore = useGroupStore()
const fixMode = ref<FixMode>('')
const fixedValue = ref({
  name: props.group.name,
  description: props.group.description,
  budget: props.group.budget.toString()
})
function changeFixMode(kind: FixMode) {
  if (kind !== '') {
    fixMode.value = kind
  } else {
    const value = {
      name: fixedValue.value.name,
      description: fixedValue.value.description,
      budget: Number(fixedValue.value.budget)
    }
    putGroup(props.group.id, value)
    fixMode.value = ''
  }
}
const putGroup = async (id: string, group: PostGroup) => {
  try {
    await apis.putGroupDetail(id, group)
  } catch (err: any) {
    alert(err.message)
  }
}
const deleteGroup = async (id: string) => {
  if (!confirm('本当にこのグループを削除しますか？')) {
    return
  }
  try {
    await apis.deleteGroup(id)
    groupStore.groups = groupStore.groups.filter(group => group.id !== id)
  } catch (err: any) {
    alert(err.message)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center">
      <div v-if="!(fixMode === 'name')" class="flex">
        <h1 class="text-3xl">
          {{ props.group.name }}
        </h1>
        <fix-button @click="changeFixMode('name')" />
        <!--todo:権限-->
      </div>
      <div v-if="fixMode === 'name'">
        <input
          v-model="fixedValue.name"
          class="rounded p-1"
          placeholder="グループ名"
          type="text" />
        <simple-button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="changeFixMode('')">
          完了
        </simple-button>
      </div>
    </div>
    <div class="mt-4">
      <group-description
        :change-fix-mode="changeFixMode"
        :fix-mode="fixMode"
        :group="group"
        :put-group="putGroup"
        :value="fixedValue.description"
        @input="fixedValue.description = $event" />
    </div>
    <div class="mt-4 h-10">
      <group-budget
        :change-fix-mode="changeFixMode"
        :fix-mode="fixMode"
        :group="group"
        :put-group="putGroup"
        :value="fixedValue.budget"
        @input="fixedValue.budget = $event" />
    </div>
    <div class="flex items-center">
      このグループの入出金記録へ
      <router-link :to="`/transactions?group=${props.group.id}`">
        <arrow-top-right-on-square-icon class="w-6" />
      </router-link>
    </div>
    <simple-button
      class="mt-4"
      font-size="sm"
      padding="sm"
      @click.stop="deleteGroup(props.group.id)">
      グループを削除
    </simple-button>
  </div>
</template>
