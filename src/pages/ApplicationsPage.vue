<script lang="ts" setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useApplicationStore } from '/@/stores/application'
import { usePartitionStore } from '/@/stores/partition'
import { useTagStore } from '/@/stores/tag'
import { useUserStore } from '/@/stores/user'

import { toPage } from '/@/lib/parseQueryParams'

import ApplicationItem from '/@/components/applications/ApplicationItem.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchApplicationsUsecase } from '/@/features/application/usecase'
import { useFetchPartitionsUsecase } from '/@/features/partition/usecase'
import { useFetchTagsUsecase } from '/@/features/tag/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

const route = useRoute()
const page = ref(toPage(route.query.page))

const { applications, isApplicationFetched } = useApplicationStore()
const { isTagFetched } = useTagStore()
const { isPartitionFetched } = usePartitionStore()
const { isUserFetched } = useUserStore()

const sliceApplicationsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return applications.value?.slice(start, end) ?? []
}

if (!isApplicationFetched.value) {
  useFetchApplicationsUsecase()
}
if (!isTagFetched.value) {
  useFetchTagsUsecase()
}
if (!isPartitionFetched.value) {
  useFetchPartitionsUsecase()
}
if (!isUserFetched.value) {
  useFetchUsersUsecase()
}

watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div class="max-w-6xl mx-auto px-3 sm:px-8 flex flex-col gap-7">
    <div class="flex flex-col">
      <div class="relative flex w-full items-center justify-start gap-7">
        <h1 class="text-center text-2xl">申請一覧</h1>
        <div>
          <RouterLink to="/applications/new">
            <SimpleButton font-size="lg" padding="md">
              申請を作成
            </SimpleButton>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="min-h-120">
      <div class="mx-auto rounded-xl shadow">
        <ul>
          <li
            v-for="application in sliceApplicationsAt(page, 7)"
            :key="application.id"
            class="hover:bg-hover-secondary">
            <ApplicationItem :application="application" />
          </li>
        </ul>
      </div>
    </div>
    <PaginationBar
      v-if="applications.length > 0"
      :current-page="page"
      path="/applications"
      :total-pages="Math.ceil(applications.length / 7)" />
  </div>
</template>
