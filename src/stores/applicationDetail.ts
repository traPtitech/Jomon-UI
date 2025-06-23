import { ref } from 'vue'
import type { ApplicationDetail } from '/@/features/application/model'
import { useFetchApplicationUsecase } from '/@/features/application/usecase'
import { defineComposable } from '/@/lib/store'

export const useApplicationDetailStore = defineComposable(
  'applicationDetail',
  () => {
    const application = ref<ApplicationDetail | null>(null)

    const useApplication = async (id: string) => {
      if (application.value !== null) {
        return application.value
      }
      const newApplication = await useFetchApplicationUsecase(id)
      application.value = newApplication
      return newApplication
    }

    return {
      application,
      useApplication
    }
  }
)
