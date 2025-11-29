import type { ApplicationDetail } from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

export const usePartitionInformation = (
  application: ApplicationDetail,
  editedContent: Ref<string>
) => {
  const toast = useToast()
  const { editApplication } = useApplicationStore()

  // 編集モードを composable 側で管理
  const isEditMode = ref(false)

  const toggleEditContent = () => {
    if (isEditMode.value) {
      // 編集キャンセル時は元の内容に戻す
      editedContent.value = application.content
    }
    isEditMode.value = !isEditMode.value
  }

  const handleUpdateContent = async () => {
    try {
      await editApplication(application.id, {
        ...application,
        partition: application.partition.id,
        content: editedContent.value
      })
      toast.success('更新しました')
      // 成功したら編集モードを閉じる
      isEditMode.value = false
    } catch {
      toast.error('更新に失敗しました')
    }
  }

  return { isEditMode, toggleEditContent, handleUpdateContent }
}
