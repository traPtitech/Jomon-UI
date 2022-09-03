<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import type { LocationQueryValue } from 'vue-router'
import { useRoute } from 'vue-router'

import SimpleButton from '../components/shared/SimpleButton.vue'
import GroupItem from '/@/components/GroupItem.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import { useGroupStore } from '/@/stores/group'

const toPage = (v: LocationQueryValue | LocationQueryValue[]) => {
  if (Array.isArray(v)) {
    v = v[0]
  }
  if (!v) return 1
  const parsed = parseInt(v)
  return isNaN(parsed) ? 1 : parsed
}

const route = useRoute()
const page = ref(toPage(route.query.page))

const groupStore = useGroupStore()
const { isGroupFetched } = storeToRefs(groupStore)

const sliceGroupsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return groupStore.groups?.slice(start, end)
}

onMounted(() => {
  if (!isGroupFetched.value) {
    groupStore.fetchGroups()
  }
})
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
        <div class="absolute right-0">
          <router-link to="/groups/new">
            <simple-button font-size="lg" padding="md">
              グループの新規作成
            </simple-button>
          </router-link>
        </div>
      </div>
      <!--フィルタリングメニューあってもいい気がする-->
      <div class="min-h-128">
        <div
          class="flex items-center justify-around bg-gray-200 px-4 pt-2 pb-2">
          <div class="w-1/5">グループ名</div>
          <div class="w-3/5">詳細</div>
          <div class="w-1/5">予算</div>
        </div>
        <ul v-if="groupStore.groups" class="divide-y">
          <li v-for="group in sliceGroupsAt(page, 10)" :key="group.id">
            <group-item :group="group" />
          </li>
        </ul>
        <div v-else>loading...</div>
      </div>
      <pagination-bar
        v-if="groupStore.groups"
        class="mt-4"
        :current-page="page"
        path="/groups"
        :total-pages="Math.ceil(groupStore.groups.length / 10)" />
    </div>
  </div>
</template>
