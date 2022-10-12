<script setup lang="ts">
import { useUserStore } from '/@/stores/user'

import { isAdmin } from '/@/lib/authorityCheck'

import SimpleButton from '/@/components/shared/SimpleButton.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()

const userStore = useUserStore()

const hasAuthority = isAdmin(userStore.me)
</script>

<template>
  <div class="px-1/6 flex flex-col items-center gap-4 py-8">
    <router-link
      v-if="hasAuthority"
      class="w-full"
      :to="`/transactions/new?requestID=${props.id}`">
      <SimpleButton class="w-full" font-size="md" padding="sm">
        この申請から入出金記録を作成する
      </SimpleButton>
    </router-link>
    <router-link class="w-full" :to="`/transactions?requestID=${props.id}`">
      <SimpleButton class="w-full" font-size="md" padding="sm">
        この申請の入出金記録へ移動
      </SimpleButton>
    </router-link>
  </div>
</template>
