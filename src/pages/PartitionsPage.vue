<script lang="ts" setup>
import PartitionTable from '@/components/partitions/PartitionTable.vue'
import PaginationBar from '@/components/shared/PaginationBar.vue'
import SimpleButton from '@/components/shared/SimpleButton.vue'
import { usePartitionStore } from '@/features/partition/store'
import { useUserStore } from '@/features/user/store'
import { toPage } from '@/lib/parseQueryParams'
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const page = ref(toPage(route.query.page))

const { partitions, isPartitionFetched, fetchPartitions } = usePartitionStore()
const { isAccountManager } = useUserStore()

if (!isPartitionFetched.value) {
  await fetchPartitions()
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
    <div class="relative flex w-full flex-wrap items-center gap-x-7 gap-y-2">
      <h1 class="text-2xl">パーティション一覧</h1>
      <div v-if="isAccountManager">
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
