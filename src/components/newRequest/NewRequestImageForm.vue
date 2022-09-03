<script lang="ts" setup>
import { XCircleIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

interface File {
  name: string
  src: string
}
interface Props {
  images: File[]
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'input', value: File[]): void }>()
const imageExtensions = /.(jpg|png|jpeg|tiff|jfif|tif|webp|avif)$/
const inputImageRef = ref()

function handleImageChange(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) {
    return
  }
  if (e.target.files) {
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      if (file.name.match(imageExtensions)) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          emit('input', [
            ...props.images,
            { name: file.name, src: reader.result as string }
          ])
        }
      } else {
        alert('画像ファイル以外はアップロードできません') //todo:画像以外もどうにかする
      }
    }
    inputImageRef.value.value = null
  }
}

function deleteImage(index: number) {
  emit(
    'input',
    props.images.filter((_, i) => index !== i)
  )
}
</script>

<template>
  <div class="flex flex-col">
    <label>画像</label>
    <input
      ref="inputImageRef"
      accept="image/*"
      multiple
      type="file"
      @change="e => handleImageChange(e)" />
  </div>
  <div>
    <div v-if="images.length === 0">画像プレビュー</div>
    <div v-if="images.length !== 0" class="flex flex-wrap">
      <div v-for="(image, index) in images" :key="index" class="relative">
        <img :alt="image.name" class="h-32" :src="image.src" />
        <button
          class="absolute top-0 right-0 h-6 w-6"
          @click="deleteImage(index)">
          <x-circle-icon />
        </button>
      </div>
    </div>
  </div>
</template>
