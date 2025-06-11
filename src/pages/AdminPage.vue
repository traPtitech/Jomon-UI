<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchAdminsUsecase } from '/@/features/admin/usecase'
import { deleteTagsUsecase, useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import { useAdminStore } from '/@/stores/admin'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'
import { useAdmin } from './composables/useAdmin'

const { isAdminFetched, admins, adminOptions } = useAdminStore()
const { me, isUserFetched, isAdmin, userMap } = useUserStore()
const { isTagFetched, tagIdOptions } = useTagStore()
const toast = useToast()

const addList = ref<string[]>([])
const removeList = ref<string[]>([])
const deleteTagList = ref<string[]>([])
const { absentMembers, isSending, addAdmins, removeAdmins } = useAdmin()

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
}

if (me.value?.admin) {
  if (!isAdminFetched.value) {
    await useFetchAdminsUsecase()
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
  <div v-if="!isAdmin" class="p-2" role="alert" aria-live="assertive">
    権限がありません。
  </div>
  <div v-else class="flex flex-col gap-6">
    <h1 class="text-2xl" tabindex="0">管理</h1>
    <div class="flex flex-col gap-3">
      <h2 id="admin-list" class="text-base font-medium" tabindex="0">管理者</h2>
      <ul class="flex gap-3" aria-labelledby="admin-list">
        <li v-for="admin in admins" :key="admin">
          <div class="border-text-primary rounded-sm border px-2 text-center">
            {{ userMap[admin] }}
          </div>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-3">
      <label for="add-admin" class="text-base font-medium" tabindex="0">
        管理者の操作
      </label>
      <div class="flex flex-wrap gap-3">
        <InputSelectMultiple
          id="add-admin"
          v-model="addList"
          aria-labelledby="manipulate-admin"
          class="grow w-auto"
          :options="absentMembers"
          placeholder="追加する管理者を選択" />
        <SimpleButton
          :disabled="isSending"
          font-size="lg"
          padding="sm"
          @click.stop="addAdmins(addList)">
          選択した管理者を追加
        </SimpleButton>
      </div>
      <div class="flex flex-wrap gap-3">
        <InputSelectMultiple
          id="delete-admin"
          v-model="removeList"
          class="grow w-auto"
          aria-labelledby="manipulate-admin"
          :options="adminOptions"
          placeholder="削除する管理者を選択" />
        <SimpleButton
          :disabled="isSending"
          font-size="lg"
          padding="sm"
          @click.stop="removeAdmins(removeList)">
          選択した管理者を削除
        </SimpleButton>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <label class="text-base font-medium" for="delete-tag">その他の操作</label>
      <div class="flex flex-wrap gap-3">
        <InputSelectMultiple
          id="delete-tag"
          v-model="deleteTagList"
          class="grow w-auto"
          :options="tagIdOptions"
          placeholder="削除するタグを選択" />
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
