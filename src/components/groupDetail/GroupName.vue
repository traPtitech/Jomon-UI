<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'
import type { GroupDetail } from '/@/lib/apis'
import { isAdminOrGroupOwner } from '/@/lib/authorityCheck'

import SimpleButton from '/@/components/shared/SimpleButton.vue'

import type { EditMode } from './GroupDetail.vue'

interface Props {
  group: GroupDetail
  isEditMode: boolean
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'changeEditMode', value: EditMode): void
}>()
const router = useRouter()

const groupStore = useGroupStore()
const userStore = useUserStore()

const hasAuthority = isAdminOrGroupOwner(userStore.me, props.group.owners)

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
  <div class="flex w-full">
    <h1 v-if="!isEditMode" class="w-4/5 text-3xl">
      {{ props.group.name }}
    </h1>
    <input
      v-else
      class="w-4/5 rounded p-1"
      placeholder="グループ名"
      type="text"
      :value="props.value"
      @input="emit('input', ($event.target as HTMLInputElement).value)" />
    <SimpleButton
      v-if="hasAuthority && !isEditMode"
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click="emit('changeEditMode', 'name')">
      編集
    </SimpleButton>
    <SimpleButton
      v-else
      class="ml-2"
      font-size="sm"
      padding="sm"
      @click.stop="emit('changeEditMode', '')">
      完了
    </SimpleButton>
    <SimpleButton
      v-if="hasAuthority"
      class="ml-2"
      font-size="sm"
      kind="danger"
      padding="sm"
      @click.stop="deleteGroup(props.group.id)">
      グループを削除
    </SimpleButton>
  </div>
</template>
