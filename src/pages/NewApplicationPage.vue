<script lang="ts" setup>
import { useToast } from 'vue-toastification'

import NewApplicationFileForm from '@/components/newApplication/NewApplicationFileForm.vue'
import NewApplicationTargets from '@/components/newApplication/NewApplicationTargets.vue'
import BaseTextInput from '@/components/shared/BaseInput/BaseTextInput.vue'
import MarkdownTextarea from '@/components/shared/MarkdownTextarea.vue'
import SearchSelect from '@/components/shared/SearchSelect/SearchSelect.vue'
import SearchSelectTag from '@/components/shared/SearchSelect/SearchSelectTag.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { applicationTemplates } from '@/features/applicationTemplate/entities'
import { usePartitionStore } from '@/features/partition/store'
import { useTagStore } from '@/features/tag/store'
import { useUserStore } from '@/features/user/store'

import { useNewApplication } from './composables/useNewApplication'

const { isTagFetched, fetchTags } = useTagStore()
const { isUserFetched, fetchUsers, me } = useUserStore()
const { isPartitionFetched, partitionOptions, fetchPartitions } =
  usePartitionStore()

const { isSending, application, files, postApplication } = useNewApplication()

const toast = useToast()

if (!isTagFetched.value) {
  fetchTags().catch(() => {
    toast.error('タグの取得に失敗しました。時間をおいて再度お試しください。')
  })
}
if (!isPartitionFetched.value) {
  fetchPartitions().catch(() => {
    toast.error(
      'パーティションの取得に失敗しました。時間をおいて再度お試しください。'
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
</script>

<template>
  <div class="pb-8">
    <h1 class="text-2xl">申請の新規作成</h1>
  </div>
  <form class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h2 class="text-sm font-medium">申請者</h2>
      <span>{{ me?.name }}</span>
    </div>
    <BaseTextInput v-model="application.title" label="タイトル" />
    <MarkdownTextarea
      v-model="application.content"
      label="詳細"
      :templates="applicationTemplates" />
    <NewApplicationTargets v-model="application.targets" />
    <SearchSelect
      v-model="application.partition"
      class="w-full"
      :options="partitionOptions"
      label="パーティション" />
    <SearchSelectTag v-model="application.tags" />
    <NewApplicationFileForm :files="files" @input="files = $event" />
    <div class="text-right">
      <SimpleButton
        :disabled="isSending"
        font-size="base"
        padding="md"
        @click.stop="postApplication">
        申請を作成
      </SimpleButton>
    </div>
  </form>
</template>
