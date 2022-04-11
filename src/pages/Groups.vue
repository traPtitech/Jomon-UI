<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import Group from '/@/components/Group.vue'
import Button from '/@/components/shared/Button.vue'
import PaginationBar from '/@/components/shared/PaginationBar.vue'
import { useGroupStore } from '/@/stores/group'

const route = useRoute()
const pageIndex = ref<number>(
  route.query.pageIndex ? Number(route.query.pageIndex) : 1
)
const groupStore = useGroupStore()
const { isGroupFetched } = storeToRefs(groupStore)

onMounted(() => {
  if (isGroupFetched.value) {
    groupStore.fetchGroups()
  }
})
watch(
  () => route.query.pageIndex,
  newId => {
    if (typeof newId === 'string') {
      pageIndex.value = Number(newId)
    }
  }
)
</script>

<template>
  <div>
    <div class="flex relative mt-2 mb-2">
      <div class="text-3xl mt-2 text-center absolute right-1 left-1">
        グループ一覧
      </div>
      <div class="ml-auto mr-40 mt-4 z-1">
        <router-link to="/groups/new">
          <Button font-size="lg" padding="md"> グループの新規作成 </Button>
        </router-link>
      </div>
    </div>
    <!--フィルタリングメニューあってもいい気がする-->
    <div
      :class="
        pageIndex === Math.ceil(groupStore.groups.length / 10) ? 'h-149' : ''
      ">
      <div class="w-2/3 mr-auto ml-auto border border-zinc-400">
        <div
          class="flex justify-around items-center bg-gray-200 pt-2 pb-2 px-4">
          <div class="w-1/5">グループ名</div>
          <div class="w-3/5">詳細</div>
          <div class="w-1/5">予算</div>
        </div>
        <div
          class="w-full bg-zinc-400 border border-solid border-zinc-400 mr-auto ml-auto" />
        <ul class="w-full mr-auto ml-auto">
          <li
            v-for="(group, index) in groupStore.groupsFilter(pageIndex)"
            :key="group.id"
            :class="
              index === groupStore.groupsFilter(pageIndex).length - 1
                ? ''
                : 'pb-2'
            ">
            <Group :group="group" />
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-4">
      <PaginationBar
        :item-length="groupStore.groups.length"
        kind="groups"
        :page-index="pageIndex"
        :unit="10" />
    </div>
  </div>
</template>
