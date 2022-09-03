<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import SimpleButton from '../shared/SimpleButton.vue'
import GroupBudget from './GroupBudget.vue'
import GroupDescription from './GroupDescription.vue'
import FixButton from '/@/components/shared/FixButton.vue'
import apis from '/@/lib/apis'
import type { PostGroup } from '/@/lib/apis'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'
import { useGroupStore } from '/@/stores/group'

export type editMode = 'name' | 'description' | 'budget' | ''

interface Props {
  group: GroupDetailType
}

const router = useRouter()
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'fixGroup', value: GroupDetailType): void
}>()
const groupStore = useGroupStore()
const editMode = ref<editMode>('')
const editedValue = ref({
  name: props.group.name,
  description: props.group.description,
  budget: props.group.budget.toString()
})
function changeEditMode(kind: editMode) {
  if (kind !== '') {
    editMode.value = kind
  } else {
    const value = {
      name: editedValue.value.name,
      description: editedValue.value.description,
      budget: Number(editedValue.value.budget)
    }
    putGroup(props.group.id, value)
    editMode.value = ''
  }
}
const putGroup = async (id: string, willPutGroup: PostGroup) => {
  try {
    const res = (await apis.putGroupDetail(id, willPutGroup)).data
    const nextGroup: GroupDetailType = {
      ...props.group,
      name: res.name,
      description: res.description,
      budget: res.budget
    }
    emit('fixGroup', nextGroup)
  } catch (err) {
    alert(err)
  }
}
const deleteGroup = async (id: string) => {
  if (!confirm('本当にこのグループを削除しますか？')) {
    return
  }
  try {
    await apis.deleteGroup(id)
    if (groupStore.groups !== undefined) {
      groupStore.groups = groupStore.groups.filter(group => group.id !== id)
      router.push('/group')
    } else {
      throw new Error('group does not exist')
    }
  } catch (err) {
    alert(err)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center">
      <div v-if="!(editMode === 'name')" class="flex">
        <h1 class="text-3xl">
          {{ props.group.name }}
        </h1>
        <fix-button @click="changeEditMode('name')" />
        <!--todo:権限-->
      </div>
      <div v-if="editMode === 'name'">
        <input
          v-model="editedValue.name"
          class="rounded p-1"
          placeholder="グループ名"
          type="text" />
        <simple-button
          class="ml-2"
          font-size="sm"
          padding="sm"
          @click.stop="changeEditMode('')">
          完了
        </simple-button>
      </div>
    </div>
    <div class="mt-4">
      <group-description
        :edit-mode="editMode"
        :group="group"
        :value="editedValue.description"
        @change-edit-mode="changeEditMode($event)"
        @input="editedValue.description = $event" />
    </div>
    <div class="mt-4 h-10">
      <group-budget
        :edit-mode="editMode"
        :group="group"
        :value="editedValue.budget"
        @change-edit-mode="changeEditMode($event)"
        @input="editedValue.budget = $event" />
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
