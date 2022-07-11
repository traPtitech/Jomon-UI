<script lang="ts" setup>
import { ExternalLinkIcon } from '@heroicons/vue/outline'
import { ref } from 'vue'

import apis from '../lib/apis'
import GroupDescription from './GroupDescription.vue'
import Button from './shared/Button.vue'
import FixButton from './shared/FixButton.vue'
import type { Group } from '/@/lib/apis'
import type { PostGroup } from '/@/lib/apis'
import { useGroupStore } from '/@/stores/group'

type Props = { group: Group }

const props = defineProps<Props>()
const groupStore = useGroupStore()
const fixMode = ref('')
const fixedValue = ref({
  name: props.group.name,
  description: props.group.description,
  budget: props.group.budget
})
function changeFixMode(kind: 'name' | 'description' | '') {
  if (kind !== '') {
    fixMode.value = kind
  } else {
    putGroup(props.group.id, fixedValue.value)
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
        <FixButton @click="changeFixMode('name')" />
        <!--todo:権限-->
      </div>
      <div v-if="fixMode === 'name'">
        <input
          v-model="fixedValue.name"
          class="rounded p-1 w-100"
          placeholder="グループ名"
          type="text" />
        <Button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="changeFixMode('')">
          完了
        </Button>
      </div>
    </div>
    <div class="flex mt-4">
      <GroupDescription />
    </div>
    <div class="mt-4">
      予算：
      {{ props.group.budget }}円
    </div>
    <div class="flex items-center">
      このグループの入出金記録へ
      <router-link :to="`/transactions?group=${props.group.id}`">
        <ExternalLinkIcon class="w-6" />
      </router-link>
    </div>
    <Button
      class="mt-4"
      font-size="sm"
      padding="sm"
      @click.stop="deleteGroup(props.group.id)">
      グループを削除
    </Button>
  </div>
</template>
