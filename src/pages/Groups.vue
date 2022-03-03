<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import Group from '../components/Group.vue'
import NewGroupModal from '../components/NewGroupModal.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { useGroupStore } from '../stores/group'
import { useRequestStore } from '../stores/request'

const route = useRoute()
const pageIndex = Number(route.query.pageIndex)
const requestStore = useRequestStore()
const groupStore = useGroupStore()
const { isModalOpen } = storeToRefs(requestStore)
const { groupsFilter, groupsLength } = storeToRefs(groupStore)

onMounted(() => {
  groupStore.getGroups()
})
function changeIsModalOpen() {
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <NewGroupModal v-if="isModalOpen" />
  <div>
    <div class="flex relative mt-2 mb-2">
      <div class="text-3xl mt-2 text-center absolute right-1 left-1">
        グループ一覧
      </div>
      <div class="ml-auto mr-70 mt-4 z-1">
        <button
          class="text-xl border border-solid border-black"
          @click="changeIsModalOpen"
        >
          グループの新規作成
        </button>
      </div>
    </div>
    <!--フィルタリングメニューあってもいい気がする-->
    <div :class="pageIndex === Math.ceil(groupsLength() / 10) ? 'h-136' : ''">
      <div class="w-2/3 mr-auto ml-auto border-solid border-black border-2">
        <div class="flex justify-around items-center bg-gray-200 pt-2 pb-2">
          <div class="w-1/10 text-center">グループ名</div>
          <div class="w-1/5 text-center">管理者</div>
          <div class="w-2/5 text-center">詳細</div>
          <div class="w-1/10 text-center">予算</div>
        </div>
        <div
          class="w-full bg-gray-400 border border-solid border-gray-400 mr-auto ml-auto"
        />
        <ul class="w-full mr-auto ml-auto">
          <li v-for="(group, index) in groupsFilter(pageIndex)" :key="group.id">
            <Group :index="index" />
            <div
              class="w-29/30 bg-gray-400 border border-solid border-gray-400 mr-auto ml-auto"
              :class="
                index === groupsFilter(pageIndex).length - 1
                  ? 'bg-white border-none'
                  : ''
              "
            />
          </li>
        </ul>
      </div>
    </div>
    <div class="mt-4">
      <PaginationBar
        :pageIndex="pageIndex"
        :itemLength="groupsLength()"
        :unit="10"
        kind="groups"
      />
    </div>
  </div>
</template>
