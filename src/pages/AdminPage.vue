<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useAdminStore } from '/@/stores/admin'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import InputSelectMultiple from '/@/components/shared/InputSelectMultiple.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchAdminsUsecase } from '/@/features/admin/usecase'
import { deleteTags, useFetchTags } from '/@/features/tag/usecase'
import { useFetchUsers } from '/@/features/user/usecase'

import { useAdmin } from './composables/useAdmin'

const adminStore = useAdminStore()
const userStore = useUserStore()
const tagStore = useTagStore()
const toast = useToast()

const { isAdminFetched, admins, adminOptions } = storeToRefs(adminStore)
const { me, isUserFetched, isAdmin, userMap } = storeToRefs(userStore)
const { isTagFetched, tagIdOptions } = storeToRefs(tagStore)

const addList = ref<string[]>([])
const removeList = ref<string[]>([])
const deleteTagList = ref<string[]>([])
const { absentMembers, isSending, addAdmins, removeAdmins } = useAdmin()

const handleDeleteTags = async () => {
  isSending.value = true
  try {
    await deleteTags(deleteTagList.value)
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
    await useFetchUsers()
  }
  if (!isTagFetched.value) {
    await useFetchTags()
  }
}
</script>

<template>
  <div v-if="!isAdmin" class="p-2">権限がありません。</div>
  <div v-else class="min-w-160 mx-auto flex w-2/3 flex-col px-12 pt-8">
    <h1 class="pb-8 text-center text-3xl">管理ページ</h1>
    <div class="flex items-center">
      管理者：
      <ul class="flex gap-2">
        <li v-for="admin in admins" :key="admin">
          <div class="border-secondary rounded border px-2 text-center">
            {{ userMap[admin] }}
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-4 flex gap-4">
      <InputSelectMultiple
        v-model="addList"
        class="!w-1/2"
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
    <div class="mt-12 flex gap-4">
      <InputSelectMultiple
        v-model="removeList"
        class="!w-1/2"
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
    <div class="mt-24 flex gap-4">
      <InputSelectMultiple
        v-model="deleteTagList"
        class="!w-1/2"
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
</template>
