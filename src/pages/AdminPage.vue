<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useAdminStore } from '/@/stores/admin'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import InputSelect from '/@/components/shared/InputSelect.vue'
import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import InputSelectSingle from '/@/components/shared/InputSelectSingle.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'

import { useAdmin } from './composables/useAdmin'

const adminStore = useAdminStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const toast = useToast()

const addList = ref<string[]>([])
const removeList = ref<string[]>([])
const deleteTagList = ref<string[]>([])
const { absentMembers, isSending, addAdmins, removeAdmins } = useAdmin()

const deleteTags = async () => {
  if (deleteTagList.value.length === 0) {
    toast.warning('削除するタグを選択してください')
    return
  }
  try {
    const deleteTagPromiseList = deleteTagList.value.map(tag =>
      tagStore.deleteTag(tag)
    )
    await Promise.all(deleteTagPromiseList)
  } catch {
    toast.error('タグの削除に失敗しました')
  }
}

if (userStore.me && userStore.me.admin) {
  if (!adminStore.isAdminFetched) {
    await adminStore.fetchAdmins()
  }
  if (!userStore.isUserFetched) {
    await userStore.fetchUsers()
  }
  if (!tagStore.isTagFetched) {
    await tagStore.fetchTags()
  }
}

const values = ref([{}])
const value = ref('')
</script>

<template>
  <div v-if="!userStore.isAdmin()" class="p-2">権限がありません。</div>
  <div v-else class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <h1 class="pb-8 text-center text-3xl">管理ページ</h1>
    <div class="flex items-center">
      管理者：
      <ul class="flex gap-2">
        <li v-for="admin in adminStore.admins" :key="admin">
          <div class="border-secondary rounded border px-2 text-center">
            {{ userStore.userMap[admin] }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-4 flex gap-4">
      <InputSelect
        v-model="addList"
        class="!w-1/2"
        is-multiple
        :options="absentMembers"
        placeholder="追加する管理者を選択" />
      <SimpleButton
        font-size="lg"
        :is-disabled="isSending"
        padding="sm"
        @click.stop="addAdmins(addList)">
        選択した管理者を追加
      </SimpleButton>
    </div>
    <div class="mt-12 flex gap-4">
      <InputSelect
        v-model="removeList"
        class="!w-1/2"
        is-multiple
        :options="adminStore.adminOptions"
        placeholder="削除する管理者を選択" />
      <SimpleButton
        font-size="lg"
        :is-disabled="isSending"
        padding="sm"
        @click.stop="removeAdmins(removeList)">
        選択した管理者を削除
      </SimpleButton>
    </div>
    <div class="mt-24 flex gap-4">
      <InputSelect
        v-model="deleteTagList"
        class="!w-1/2"
        is-multiple
        :options="tagStore.tagOptions"
        placeholder="削除するタグを選択" />
      <SimpleButton font-size="lg" padding="sm" @click.stop="deleteTags">
        選択したタグを削除
      </SimpleButton>
    </div>
    <InputSelectMultiple
      v-model="values"
      class="w-1/2"
      :create-option="option => option + 'aaa'"
      :options="[
        { key: 'aaa', value: 'bbb' },
        { key: 'ccc', value: 'ddd' },
        { key: 'eee', value: 'fff' },
        { key: 'ggg', value: 'hhh' },
        { key: 'iii', value: 'jjj' },
        { key: 'kkk', value: 'lll' },
        { key: 'mmm', value: 'nnn' },
        { key: 'ooo', value: 'ppp' }
      ]"
      placeholder="選択してください"
      taggable />
    <InputSelectSingle
      v-model="value"
      class="w-1/2"
      :options="[
        { key: 'aaa', value: 'bbb' },
        { key: 'ccc', value: 'ddd' },
        { key: 'eee', value: 'fff' },
        { key: 'ggg', value: 'hhh' },
        { key: 'iii', value: 'jjj' },
        { key: 'kkk', value: 'lll' },
        { key: 'mmm', value: 'nnn' },
        { key: 'ooo', value: 'ppp' }
      ]"
      placeholder="選択してください"
      taggable />
  </div>
</template>
