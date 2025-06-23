<script lang="ts" setup>
import { usePartitionStore } from '/@/stores/partition'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import NewApplicationFileForm from '/@/components/newApplication/NewApplicationFileForm.vue'
import NewApplicationTargets from '/@/components/newApplication/NewApplicationTargets.vue'
import BaseInput from '/@/components/shared/BaseInput.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import SearchSelectTag from '/@/components/shared/SearchSelectTag.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { applicationTemplates } from '/@/features/applicationTemplate/model'
import { useFetchPartitionsUsecase } from '/@/features/partition/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

import { useNewApplication } from './composables/useNewApplication'

const { isTagFetched } = useTagStore()
const { isUserFetched, me } = useUserStore()
const { isPartitionFetched, partitionOptions } = usePartitionStore()

const { isSending, application, files, postApplication } = useNewApplication()

if (!isTagFetched.value) {
  useFetchTagsUsecase()
}
if (!isPartitionFetched.value) {
  useFetchPartitionsUsecase()
}
if (!isUserFetched.value) {
  useFetchUsersUsecase()
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
    <BaseInput v-model="application.title" label="タイトル" />
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
