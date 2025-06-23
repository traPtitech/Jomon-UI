<script lang="ts" setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { usePartitonStore } from '/@/stores/partiton'
import { useUserStore } from '/@/stores/user'

import { toPage } from '/@/lib/parseQueryParams'

import PaginationBar from '/@/components/shared/PaginationBar.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useFetchPartitonsUsecase } from '/@/features/partiton/usecase'
import PartitonTable from '/@/components/partitons/PartitonTable.vue'

const route = useRoute()
const page = ref(toPage(route.query.page))

const { partitons, isPartitonFetched } = usePartitonStore()
const { isAdmin } = useUserStore()

if (!isPartitonFetched.value) {
  await useFetchPartitonsUsecase()
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

    <PartitonTable :page="page" :partitons="partitons" />

    <PaginationBar
      v-if="partitons.length > 0"
      :current-page="page"
      path="/partitions"
      :total-pages="Math.ceil(partitons.length / 10)" />
  </div>
</template>
