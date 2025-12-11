import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { useToast } from 'vue-toastification'

import type { ApplicationTargetDraft } from '@/components/applicationDetail/types'
import type { ApplicationSeed } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { ApplicationTarget } from '@/features/applicationTarget/entities'
import type { FileSeed } from '@/features/file/entities'
import { createFiles } from '@/features/file/services'
import { useUserStore } from '@/features/user/store'

export const useNewApplication = () => {
  const toast = useToast()
  const router = useRouter()
  const { me } = useUserStore()
  const { createApplication } = useApplicationStore()

  const isSending = ref(false)

  type ApplicationForm = Omit<ApplicationSeed, 'targets' | 'partition'> & {
    targets: ApplicationTargetDraft[]
    partition: string | null
  }

  const hasFilledTargets = (
    targets: ApplicationTargetDraft[]
  ): targets is ApplicationTarget[] =>
    targets.every(
      target =>
        target.target !== null &&
        target.target !== '' &&
        target.amount !== null &&
        target.amount > 0
    )

  const application = ref<ApplicationForm>({
    createdBy: me.value?.id ?? '',
    title: '',
    targets: [{ target: '', amount: null }],
    content: '',
    tags: [],
    partition: null,
  })
  const files = ref<FileSeed[]>([])

  const postApplication = async () => {
    if (
      application.value.title === '' ||
      application.value.content === '' ||
      application.value.targets.length === 0
    ) {
      toast.warning('タイトル、詳細、対象者は必須です')
      return
    }
    if (!application.value.partition) {
      toast.warning('パーティションは必須です')
      return
    }
    const { targets } = application.value
    if (!hasFilledTargets(targets)) {
      toast.warning('対象者の選択と金額の入力は必須です')
      return
    }
    isSending.value = true

    try {
      const applicationSeedWithNewTags: ApplicationSeed = {
        createdBy: application.value.createdBy,
        title: application.value.title,
        content: application.value.content,
        tags: application.value.tags,
        partition: application.value.partition,
        targets,
      }
      const res = await createApplication(applicationSeedWithNewTags)
      try {
        await createFiles(res.id, files.value)
        toast.success('申請を作成しました')
        await router.push('/')
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message)
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }
  return { isSending, application, files, postApplication }
}
