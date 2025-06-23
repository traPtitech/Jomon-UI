<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'

import { usePartitonDetailStore } from '/@/stores/partitonDetail'
import { useUserStore } from '/@/stores/user'

import { toId } from '/@/lib/parsePathParams'

import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import PartitonBudget from '/@/components/partitonDetail/PartitonBudget.vue'
import PartitonName from '/@/components/partitonDetail/PartitonName.vue'
import { usePartitonInformation } from '/@/components/partitonDetail/composables/usePartitonInformation'
import { useFetchPartiton } from '/@/features/partiton/usecase'
import { useFetchUsersUsecase } from '/@/features/user/usecase'

const route = useRoute()
const id = toId(route.params.id)

const { isUserFetched } = useUserStore()
const { partiton } = usePartitonDetailStore()

const { isSending, editMode, changeEditMode, finishEditing } =
  usePartitonInformation()

await useFetchPartiton(id)
if (!isUserFetched.value) {
  await useFetchUsersUsecase()
}
</script>

<template>
  <div v-if="partiton !== undefined" class="flex flex-col gap-6">
    <div class="flex">
      <PartitonName
        class="grow"
        :is-edit-mode="editMode === 'name'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
    </div>
    <div class="grow flex flex-col gap-6">
      <PartitonBudget
        :is-edit-mode="editMode === 'budget'"
        :is-sending="isSending"
        @change-edit-mode="changeEditMode($event)"
        @finish-editing="finishEditing" />
      <RouterLink
        class="flex w-fit items-center"
        :to="`/transactions?partiton=${partiton.id}`">
        このパーティションの入出金記録へ
        <ArrowTopRightOnSquareIcon class="ml-1 w-6" />
      </RouterLink>
    </div>
  </div>
</template>
