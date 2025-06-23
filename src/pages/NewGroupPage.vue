<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import BaseInput from '/@/components/shared/BaseInput.vue'
import SimpleButton from '/@/components/shared/SimpleButton.vue'
import { createPartitonUsecase } from '/@/features/partiton/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'
import { useUserStore } from '/@/stores/user'
import { useNewPartiton } from './composables/useNewPartiton'

const toast = useToast()
const router = useRouter()

const { isUserFetched } = useUserStore()

const { isSending, partiton } = useNewPartiton()

const handleCreatePartiton = async () => {
  try {
    await createPartitonUsecase(partiton.value)
    toast.success('パーティションを作成しました')
    router.push('/partitions')
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  }
}

if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
</script>

<template>
  <div class="mb-6">
    <h1 class="text-2xl">パーティションの新規作成</h1>
  </div>
  <form class="flex flex-col gap-6">
    <BaseInput v-model="partiton.name" label="パーティション名" required />
    <BaseInput v-model="partiton.budget" type="number" label="予算" required>
      <span class="text-2xl font-bold ml-3 mt-auto mb-2 text-text-secondary">
        ¥
      </span>
    </BaseInput>
    <div>
      <SimpleButton
        class="ml-auto mt-8 block"
        :disabled="isSending"
        font-size="xl"
        padding="md"
        @click="handleCreatePartiton">
        パーティションを作成
      </SimpleButton>
    </div>
  </form>
</template>
