import type { ApplicationSeed } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { FileSeed } from '@/features/file/entities'
import { createFiles } from '@/features/file/services'
import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'
import { useUserStore } from '@/features/user/store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export const useNewApplication = () => {
  const toast = useToast()
  const router = useRouter()
  const { me } = useUserStore()
  const { createApplication } = useApplicationStore()
  const { ensureTags } = useTagStore()

  const isSending = ref(false)

  const application = ref<ApplicationSeed>({
    createdBy: me.value?.id ?? '',
    title: '',
    targets: [{ target: '', amount: 0 }],
    content: '',
    tags: [],
    partition: ''
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
    if (
      application.value.targets.some(
        target => target.target === '' || target.amount === 0
      )
    ) {
      toast.warning('対象者の選択と金額の入力は必須です')
      return
    }
    isSending.value = true

    let tags: Tag[]
    try {
      tags = await ensureTags(application.value.tags)
    } catch (e) {
      if (e instanceof Error && e.message) {
        toast.error(e.message)
      } else {
        toast.error('新規タグの作成に失敗しました')
      }
      isSending.value = false
      return
    }

    try {
      const applicationSeedWithNewTags = {
        ...application.value,
        tags
      }
      const res = await createApplication(applicationSeedWithNewTags)
      try {
        await createFiles(res.id, files.value)
        toast.success('申請を作成しました')
        router.push('/')
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
