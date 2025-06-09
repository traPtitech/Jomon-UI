<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import BaseInput from '/@/components/shared/BaseInput.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { createGroupUsecase } from '/@/features/group/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import { useUserStore } from '/@/stores/user'
import { useNewGroup } from './composables/useNewGroup'

const toast = useToast()
const router = useRouter()

const userStore = useUserStore()
const { isUserFetched, userOptions } = storeToRefs(userStore)

const { isSending, group } = useNewGroup()

const handleCreateGroup = async () => {
  try {
    await createGroupUsecase(group.value)
    toast.success('グループを作成しました')
    router.push('/groups')
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
}

if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl">グループの新規作成</h1>
  </div>
  <form class="flex flex-col gap-6">
    <BaseInput v-model="group.name" label="グループ名" required />
    <MarkdownTextarea v-model="group.description" label="説明" required />
    <BaseInput v-model="group.budget" type="number" label="予算" required>
      <span class="text-2xl font-bold ml-3 mt-auto mb-2 text-text-secondary">
        ¥
      </span>
    </BaseInput>
    <SearchSelect
      v-model="group.owners"
      class="w-full"
      :options="userOptions"
      multiple
      label="オーナー" />
    <SearchSelect
      v-model="group.members"
      class="w-full"
      :options="userOptions"
      multiple
      label="メンバー" />
    <div>
      <SimpleButton
        class="ml-auto mt-8 block"
        :disabled="isSending"
        font-size="xl"
        padding="md"
        @click="handleCreateGroup">
        グループを作成
      </SimpleButton>
    </div>
  </form>
</template>
