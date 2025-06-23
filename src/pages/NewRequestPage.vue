<script lang="ts" setup>
import { usePartitonStore } from '/@/stores/partiton'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import NewRequestFileForm from '/@/components/newRequest/NewRequestFileForm.vue'
import NewRequestTargets from '/@/components/newRequest/NewRequestTargets.vue'
import BaseInput from '/@/components/shared/BaseInput.vue'
import SearchSelect from '/@/components/shared/SearchSelect.vue'
import SearchSelectTag from '/@/components/shared/SearchSelectTag.vue'
import MarkdownTextarea from '/@/components/shared/MarkdownTextarea.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchPartitonsUsecase } from '/@/features/partiton/usecase'
import { requestTemplates } from '/@/features/requestTemplate/model'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

import { useNewRequest } from './composables/useNewRequest'

const { isTagFetched } = useTagStore()
const { isUserFetched, me } = useUserStore()
const { isPartitonFetched, partitonOptions } = usePartitonStore()

const { isSending, request, files, postRequest } = useNewRequest()

if (!isTagFetched.value) {
  useFetchTagsUsecase()
}
if (!isPartitonFetched.value) {
  useFetchPartitonsUsecase()
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
    <BaseInput v-model="request.title" label="タイトル" />
    <MarkdownTextarea
      v-model="request.content"
      label="詳細"
      :templates="requestTemplates" />
    <NewRequestTargets v-model="request.targets" />
    <SearchSelect
      v-model="request.partition"
      class="w-full"
      :options="partitonOptions"
      label="パーティション" />
    <SearchSelectTag v-model="request.tags" />
    <NewRequestFileForm :files="files" @input="files = $event" />
    <div class="text-right">
      <SimpleButton
        :disabled="isSending"
        font-size="base"
        padding="md"
        @click.stop="postRequest">
        申請を作成
      </SimpleButton>
    </div>
  </form>
</template>
