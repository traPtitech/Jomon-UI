<script lang="ts" setup>
import { useAccountManager } from './composables/useAccountManager'
import SearchSelect from '@/components/shared/SearchSelect.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { useAccountManagerStore } from '@/features/accountManager/store'
import { useTagStore } from '@/features/tag/store'
import { useUserStore } from '@/features/user/store'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const {
  isAccountManagerFetched,
  accountManagers,
  accountManagerOptions,
  fetchAccountManagers
} = useAccountManagerStore()
const {
  me,
  isUserFetched,
  isAccountManager,
  getUserNameWithFallback,
  fetchUsers
} = useUserStore()
const { isTagFetched, tagIdOptions, deleteTags, fetchTags } = useTagStore()
const toast = useToast()

const addList = ref<string[]>([])
const removeList = ref<string[]>([])
const deleteTagList = ref<string[]>([])
const { absentMembers, isSending, addAccountManagers, removeAccountManagers } =
  useAccountManager()

const handleDeleteTags = async () => {
  if (deleteTagList.value.length === 0) {
    toast.warning('1つ以上のタグを選択してください')
    return
  }
  isSending.value = true
  try {
    await deleteTags(deleteTagList.value)
    toast.success('タグを削除しました')
  } catch (e) {
    if (e instanceof Error && e.message) {
      toast.error(e.message)
    } else {
      toast.error('タグの削除に失敗しました')
    }
  }
  isSending.value = false
  deleteTagList.value = []
}

if (me.value?.accountManager) {
  if (!isAccountManagerFetched.value) {
    fetchAccountManagers().catch(() => {
      toast.error(
        '会計管理者の取得に失敗しました。時間をおいて再度お試しください。'
      )
    })
  }
  if (!isUserFetched.value) {
    fetchUsers().catch(() => {
      toast.error(
        'ユーザーの取得に失敗しました。時間をおいて再度お試しください。'
      )
    })
  }
  if (!isTagFetched.value) {
    fetchTags().catch(() => {
      toast.error('タグの取得に失敗しました。時間をおいて再度お試しください。')
    })
  }
}
</script>

<template>
  <div v-if="!isAccountManager" class="p-2" role="alert" aria-live="assertive">
    権限がありません。
  </div>
  <div v-else class="flex flex-col gap-6">
    <h1 class="text-2xl">管理</h1>
    <div class="flex flex-col gap-3">
      <h2 class="text-base font-medium">会計管理者</h2>
      <ul class="flex gap-3" aria-labelledby="accountManager-list">
        <li v-for="accountManager in accountManagers" :key="accountManager">
          <div class="rounded-sm border border-text-primary px-2 text-center">
            {{ getUserNameWithFallback(accountManager) }}
          </div>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-base font-medium">会計管理者の操作</h2>
      <div class="flex flex-wrap gap-3">
        <SearchSelect
          v-model="addList"
          class="w-auto grow"
          multiple
          :options="absentMembers"
          label="追加する会計管理者" />
        <SimpleButton
          :disabled="isSending"
          font-size="lg"
          padding="sm"
          class="max-h-14"
          @click.stop="
            () => {
              addAccountManagers(addList)
              addList = []
            }
          ">
          選択した会計管理者を追加
        </SimpleButton>
      </div>
      <div class="flex flex-wrap gap-3">
        <SearchSelect
          v-model="removeList"
          class="w-auto grow"
          multiple
          :options="accountManagerOptions"
          label="削除する会計管理者" />
        <SimpleButton
          :disabled="isSending"
          font-size="lg"
          padding="sm"
          class="max-h-14"
          @click.stop="
            () => {
              removeAccountManagers(removeList)
              removeList = []
            }
          ">
          選択した会計管理者を削除
        </SimpleButton>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-base font-medium">タグの操作</h2>
      <div class="flex flex-wrap gap-3">
        <SearchSelect
          v-model="deleteTagList"
          label="削除するタグ"
          class="w-auto grow"
          multiple
          :options="tagIdOptions" />
        <SimpleButton
          :disabled="deleteTagList.length === 0 || isSending"
          font-size="lg"
          padding="sm"
          class="max-h-14"
          @click.stop="handleDeleteTags">
          選択したタグを削除
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
