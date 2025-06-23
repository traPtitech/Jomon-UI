<script lang="ts" setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { usePartitionStore } from '/@/stores/partition'
import { useUserStore } from '/@/stores/user'

import { toPage } from '/@/lib/parseQueryParams'

import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchPartitionsUsecase } from '/@/features/partition/usecase'
import PartitionTable from '/@/components/partitions/PartitionTable.vue'

const route = useRoute()
const page = ref(toPage(route.query.page))

const { partitions, isPartitionFetched } = usePartitionStore()
const { isAdmin } = useUserStore()

if (!isPartitionFetched.value) {
  await useFetchPartitionsUsecase()
}

watch(
  () => route.query.page,
  newPage => {
    page.value = toPage(newPage)
  }
)
</script>

<template>
  <div class="flex flex-col gap-7">
    <div class="relative flex flex-wrap gap-x-7 gap-y-2 w-full items-center">
      <h1 class="text-2xl">パーティション一覧</h1>
      <div v-if="isAdmin">
        <RouterLink to="/partitions/new">
          <SimpleButton font-size="lg" padding="md">
            パーティションを作成
          </SimpleButton>
        </RouterLink>
      </div>
    </div>

    <PartitionTable :page="page" :partitions="partitions" />

    <PaginationBar
      v-if="partitions.length > 0"
      :current-page="page"
      path="/partitions"
      :total-pages="Math.ceil(partitions.length / 10)" />
  </div>
</template>
