<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAccountManager } from './composables/useAccountManager'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchAccountManagersUsecase } from '/@/features/accountManager/usecase'
import { deleteTagsUsecase, useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import { useAccountManagerStore } from '/@/stores/accountManager'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

const { isAccountManagerFetched, accountManagers, accountManagerOptions } =
  useAccountManagerStore()
const { me, isUserFetched, isAccountManager, userMap } = useUserStore()
const { isTagFetched, tagIdOptions } = useTagStore()
const toast = useToast()

const addList = ref<string[]>([])
const removeList = ref<string[]>([])
const deleteTagList = ref<string[]>([])
const { absentMembers, isSending, addAccountManagers, removeAccountManagers } =
  useAccountManager()

const handleDeleteTags = async () => {
  isSending.value = true
  try {
    await deleteTagsUsecase(deleteTagList.value)
    toast.success('タグを削除しました')
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
  isSending.value = false
  deleteTagList.value = []
}

if (me.value?.accountManager) {
  if (!isAccountManagerFetched.value) {
    await useFetchAccountManagersUsecase()
  }
  if (!isUserFetched.value) {
    await useFetchUsersUsecase()
  }
  if (!isTagFetched.value) {
    await useFetchTagsUsecase()
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
          <div class="border-text-primary rounded-sm border px-2 text-center">
            {{ userMap[accountManager] }}
          </div>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-3">
      <h2 class="text-base font-medium">会計管理者の操作</h2>
      <div class="flex flex-wrap gap-3">
        <SearchSelect
          v-model="addList"
          class="grow w-auto"
          multiple
          :options="absentMembers"
          label="追加する会計管理者" />
        <SimpleButton
          :disabled="isSending"
          font-size="lg"
          padding="sm"
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
          class="grow w-auto"
          multiple
          :options="accountManagerOptions"
          label="削除する会計管理者" />
        <SimpleButton
          :disabled="isSending"
          font-size="lg"
          padding="sm"
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
          class="grow w-auto"
          multiple
          :options="tagIdOptions" />
        <SimpleButton
          :disabled="deleteTagList.length === 0 || isSending"
          font-size="lg"
          padding="sm"
          @click.stop="handleDeleteTags">
          選択したタグを削除
        </SimpleButton>
      </div>
    </div>
  </div>
</template>
