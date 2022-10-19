import type { AxiosResponse } from 'axios'
import { useToast } from 'vue-toastification'

import { useTagStore } from '/@/stores/tag'

import apis from '/@/lib/apis'
import type { Tag } from '/@/lib/apis'

export const usePostTags = () => {
  const tagStore = useTagStore()
  const toast = useToast()

  const postTags = async (requestTags: string[]) => {
    const postTagResults: ReturnType<typeof apis.postTag>[] = []
    let tags: string[] = []
    // 以下の2パターンで場合分けしていて、条件式が1でtrue、2でfalseになる
    // 1. willPutRequest.tagsに入っているidがtagStore.tagsのタグのidと一致する
    // 2. タグが新規作成されて、そのタグ名がwillPutRequest.tagsに入っている
    // 2の場合にはタグ名がtagStore.tagsのタグidと一致することはないので、tagPostPromisesにpostTag関数がpushされる
    requestTags.forEach((tag: string) => {
      if (tagStore.tags?.some(t => t.id === tag)) {
        tags.push(tag)
        return
      }
      postTagResults.push(apis.postTag({ name: tag }))
    })
    try {
      tags = tags.concat(
        (await Promise.all(postTagResults)).map(
          (tag: AxiosResponse<Tag>) => tag.data.id
        )
      )
    } catch {
      toast.error('新規タグの作成に失敗しました')
      throw new Error('新規タグの作成に失敗しました')
    }
    return tags
  }

  return { postTags }
}
