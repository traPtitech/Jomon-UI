<script lang="ts" setup>
import ButtonRepo from '@/components/ButtonRepo.vue'
</script>

<template>
  <main>
    <div class="bg-gray-50">
      <div
        class="
          mx-auto
          max-w-screen-xl
          py-12
          px-4
          sm:px-6
          lg:flex lg:py-16 lg:px-8 lg:items-center lg:justify-between
        "
      >
        <h2
          class="
            font-extrabold
            tracking-tight
            text-3xl text-gray-900
            leading-9
            sm:text-4xl sm:leading-10
          "
        >
          About Page
          <br />
          <span class="text-indigo-600">Vite 2.x + Vue 3.x + Tailwind 2.x</span>
        </h2>
        <div class="flex mt-8 lg:flex-shrink-0 lg:mt-0">
          <div class="rounded-md shadow inline-flex">
            <router-link
              class="
                border border-transparent
                rounded-md
                font-medium
                bg-indigo-600
                text-base text-white
                py-3
                px-5
                transition
                ease-in-out
                leading-6
                duration-150
                inline-flex
                items-center
                justify-center
                hover:bg-indigo-500
                focus:outline-none
              "
              to="/"
              >Back Home</router-link
            >
          </div>
          <ButtonRepo />
        </div>
      </div>
    </div>
  </main>
</template>
