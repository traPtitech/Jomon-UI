<script lang="ts" setup>
type Props = {
  pageIndex: number
  itemLength: number
  unit: number
  kind: string
} //pageIndexはページ番号(routeから取ってくる)、itemLengthは全体の要素数(storeのgettersで計算)、unitは1ページに表示している個数(自分で決められるが、v-forで回す数と一致させる)、kindは"requests"や"transactions"や"groups"などパスで使う名前
const props = defineProps<Props>()
</script>
<template>
  <div class="text-center w-full">
    <div class="flex justify-center">
      <router-link
        class="w-24 h-8 block border border-solid border-black"
        :class="pageIndex === 1 ? 'bg-gray-200 cursor-default' : ''"
        :to="
          pageIndex !== 1
            ? `/${kind}/?pageIndex=` + (pageIndex - 1).toString()
            : `/${kind}/?pageIndex=1`
        "
        ><span class=""> 前のページへ </span></router-link
      >
      <router-link
        v-for="index in Math.ceil(itemLength / unit) <= 6
          ? [...Array(Math.ceil(itemLength / unit)).keys()]
          : pageIndex >= 5
          ? [...Array(2).keys()]
          : [...Array(5).keys()]"
        :key="index"
        class="mr-2 ml-2 w-8 h-8 block border border-solid border-black"
        :class="index + 1 === pageIndex ? 'bg-blue-300 cursor-default' : ''"
        :to="`/${kind}/?pageIndex=` + (index + 1).toString()"
      >
        <span>{{ index + 1 }}</span></router-link
      >
      <span v-if="Math.ceil(itemLength / unit) >= 8">...</span>

      <router-link
        v-for="index in pageIndex <= 4 ? null : [...Array(5).keys()]"
        v-if="
          Math.ceil(itemLength / unit) >= 5 &&
          5 <= pageIndex &&
          pageIndex < Math.ceil(itemLength / unit) - 3
        "
        class="mr-2 ml-2 w-8 h-8 block border border-solid border-black"
        :class="index === 2 ? 'bg-blue-300 cursor-default' : ''"
        :to="`/${kind}/?pageIndex=` + (index + pageIndex - 2).toString()"
      >
        <span>{{ index + pageIndex - 2 }}</span>
      </router-link>

      <span v-if="Math.ceil(itemLength / unit) >= 8">...</span>
      <router-link
        v-if="Math.ceil(itemLength / unit) >= 7"
        v-for="index in pageIndex >= Math.ceil(itemLength / unit) - 3 &&
        pageIndex !== 4
          ? [...Array(5).keys()].reverse()
          : [...Array(2).keys()].reverse()"
        :key="index"
        class="mr-2 ml-2 w-8 h-8 block border border-solid border-black"
        :class="
          pageIndex === Math.ceil(itemLength / unit) - index
            ? 'bg-blue-300 cursor-default'
            : ''
        "
        :to="
          `/${kind}/?pageIndex=` +
          (Math.ceil(itemLength / unit) - index).toString()
        "
      >
        <span>{{ Math.ceil(itemLength / unit) - index }}</span></router-link
      >
      <router-link
        class="w-24 h-8 block border border-solid border-black"
        :class="pageIndex === Math.ceil(itemLength / unit) ? 'bg-gray-200' : ''"
        :to="
          pageIndex !== Math.ceil(itemLength / unit)
            ? `/${kind}/?pageIndex=` + (pageIndex + 1).toString()
            : `/${kind}/?pageIndex=` + Math.ceil(itemLength / unit).toString()
        "
        ><span class=""> 次のページへ </span></router-link
      >
    </div>
  </div>
</template>
