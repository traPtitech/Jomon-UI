<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { useRequestDetailStore } from '/@/stores/requestDetail'
import { useUserStore } from '/@/stores/user'

import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { useNewTransaction } from '/@/pages/composables/useNewTransaction'

const userStore = useUserStore()
const requestDetailStore = useRequestDetailStore()
const { postTransactionFromRequest } = useNewTransaction()

const { request } = storeToRefs(requestDetailStore)
</script>

<template>
  <div class="px-1/6 flex flex-col items-center gap-4 py-8">
    <SimpleButton
      v-if="userStore.isAdmin()"
      class="w-full"
      font-size="md"
      padding="sm"
      @click="request && postTransactionFromRequest(request)">
      この申請から入出金記録を作成する
    </SimpleButton>
    <RouterLink class="w-full" :to="`/transactions?requestID=${request?.id}`">
      <SimpleButton class="w-full" font-size="md" padding="sm">
        この申請の入出金記録へ移動
      </SimpleButton>
    </RouterLink>
  </div>
</template>
