<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

import { toPage } from '/@/lib/parseQueryParams'

import GroupItem from '/@/components/groups/GroupItem.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchGroupsUsecase } from '/@/features/group/usecase'

const route = useRoute()
const page = ref(toPage(route.query.page))

const userStore = useUserStore()
const groupStore = useGroupStore()
const { groups, isGroupFetched } = storeToRefs(groupStore)
const { isAdmin } = storeToRefs(userStore)

const sliceGroupsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return groups.value.slice(start, end) ?? []
}

if (!isGroupFetched.value) {
  await useFetchGroupsUsecase()
}

watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div>
    <div class="min-w-160 mx-auto flex w-2/3 flex-col">
      <div class="relative flex w-full items-center justify-center py-8">
        <h1 class="text-center text-3xl">グループ一覧</h1>
        <div v-if="isAdmin" class="absolute right-0">
          <RouterLink to="/groups/new">
            <SimpleButton font-size="lg" padding="md">
              グループの新規作成
            </SimpleButton>
          </RouterLink>
        </div>
      </div>

      <div class="min-h-128">
        <div
          class="flex items-center justify-around bg-surface-tertiary px-4 pt-2 pb-2">
          <div class="w-1/5">グループ名</div>
          <div class="w-3/5">詳細</div>
          <div class="w-1/5">予算</div>
        </div>
        <ul class="divide-y">
          <li v-for="group in sliceGroupsAt(page, 10)" :key="group.id">
            <GroupItem :group="group" />
          </li>
        </ul>
      </div>
      <PaginationBar
        v-if="groups.length > 0"
        class="mt-4"
        :current-page="page"
        path="/groups"
        :total-pages="Math.ceil(groups.length / 10)" />
    </div>
  </div>
</template>
