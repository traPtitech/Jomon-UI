<script lang="ts" setup>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import GroupBudget from './GroupBudget.vue'
import GroupDescription from './GroupDescription.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import apis from '/@/lib/apis'
import type { PostGroup } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'
import type { GroupDetailType } from '/@/pages/GroupDetailPage.vue'
import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

export type EditMode = 'name' | 'description' | 'budget' | ''

interface Props {
  group: GroupDetailType
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'fixGroup', value: GroupDetailType): void
}>()
const router = useRouter()

const userStore = useUserStore()
const groupStore = useGroupStore()

const editMode = ref<EditMode>('')
const editedValue = ref({
  name: props.group.name,
  description: props.group.description,
  budget: props.group.budget.toString()
})
const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)

async function changeEditMode(kind: EditMode) {
  if (kind !== '') {
    editMode.value = kind
  } else {
    const value = {
      name: editedValue.value.name,
      description: editedValue.value.description,
      budget: Number(editedValue.value.budget)
    }
    await putGroup(props.group.id, value)
    editMode.value = ''
  }
}
const putGroup = async (id: string, willPutGroup: PostGroup) => {
  if (!hasAuthority) {
    alert('権限がありません。')
    return
  }
  try {
    const res = (await apis.putGroupDetail(id, willPutGroup)).data
    const nextGroup: GroupDetailType = {
      ...props.group,
      name: res.name,
      description: res.description,
      budget: res.budget
    }
    emit('fixGroup', nextGroup)
    editedValue.value = {
      name: nextGroup.name,
      description: nextGroup.description,
      budget: nextGroup.budget.toString()
    }
  } catch (err) {
    alert(err)
  }
}
const deleteGroup = async (id: string) => {
  if (!hasAuthority) {
    alert('権限がありません。')
    return
  }
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
      <div v-if="!(editMode === 'name')" class="flex w-full">
        <h1 class="w-6/7 text-3xl">
          {{ props.group.name }}
        </h1>
        <div>
          <simple-button
            v-if="hasAuthority"
            class="ml-2"
            font-size="sm"
            padding="sm"
            @click="changeEditMode('name')">
            編集
          </simple-button>
        </div>
      </div>
      <div v-else class="flex w-full">
        <input
          v-model="editedValue.name"
          class="w-6/7 rounded p-1"
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
        :group="group"
        :is-edit-mode="editMode === 'description'"
        :value="editedValue.description"
        @change-edit-mode="changeEditMode($event)"
        @input="editedValue.description = $event" />
    </div>
    <div class="mt-4 h-10">
      <group-budget
        :group="group"
        :is-edit-mode="editMode === 'budget'"
        :value="editedValue.budget"
        @change-edit-mode="changeEditMode($event)"
        @input="editedValue.budget = $event" />
    </div>
    <div>
      <button>
        <router-link
          class="flex items-center"
          :to="`/transactions?group=${props.group.id}`">
          このグループの入出金記録へ
          <arrow-top-right-on-square-icon class="w-6" />
        </router-link>
      </button>
    </div>
    <simple-button
      v-if="hasAuthority"
      class="mt-2 bg-red-500 text-white"
      font-size="sm"
      padding="sm"
      @click.stop="deleteGroup(props.group.id)">
      グループを削除
    </simple-button>
  </div>
</template>
