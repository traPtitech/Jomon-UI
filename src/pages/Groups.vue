<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { ref, watch } from 'vue'
import type { LocationQueryValue } from 'vue-router'
import { useRoute } from 'vue-router'

import Group from '/@/components/Group.vue'
import Button from '/@/components/shared/Button.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import { useGroupStore } from '/@/stores/group'

const toPageIndex = (v: LocationQueryValue | LocationQueryValue[]) => {
  if (Array.isArray(v)) {
    v = v[0]
  }
  if (!v) return 1
  const parsed = parseInt(v)
  return isNaN(parsed) ? 1 : parsed
}

const route = useRoute()
const pageIndex = ref(toPageIndex(route.query.pageIndex))
const groupStore = useGroupStore()
const { isGroupFetched } = storeToRefs(groupStore)

const sliceGroupsAt = (index: number, n: number) => {
  const start = (index - 1) * n
  const end = index * n
  return groupStore.groups.slice(start, end)
}

onMounted(() => {
  if (!isGroupFetched.value) {
    groupStore.fetchGroups()
  }
})
watch(
  () => route.query.pageIndex,
  newId => {
    pageIndex.value = toPageIndex(newId)
  }
)
</script>

<template>
  <div>
    <div class="flex flex-col mx-auto min-w-160 w-2/3">
      <div class="flex w-full py-8 justify-center items-center relative">
        <h1 class="text-center text-3xl">グループ一覧</h1>
        <div class="right-0 absolute">
          <router-link to="/groups/new">
            <Button font-size="lg" padding="md"> グループの新規作成 </Button>
          </router-link>
        </div>
      </div>
      <!--フィルタリングメニューあってもいい気がする-->
      <div class="min-h-128">
        <div
          class="flex bg-gray-200 px-4 pt-2 pb-2 justify-around items-center">
          <div class="w-1/5">グループ名</div>
          <div class="w-3/5">詳細</div>
          <div class="w-1/5">予算</div>
        </div>
        <ul class="divide-y">
          <li v-for="group in sliceGroupsAt(pageIndex, 10)" :key="group.id">
            <Group :group="group" />
          </li>
        </ul>
      </div>
      <PaginationBar
        class="mt-4"
        :current-page="pageIndex"
        path="/groups"
        :total-pages="Math.ceil(groupStore.groups.length / 10)" />
    </div>
  </div>
</template>
