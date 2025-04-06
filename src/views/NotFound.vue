<template>
  <BaseLayout>
    <template #default>
      <div class="flex flex-col justify-center items-center h-screen">
        <h1
          class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 w-fit"
        >
          Página não encontrada!
        </h1>
        <RouterLink
          to="/"
          class="bg-gray-800/50 rounded-2xl p-4 backdrop-blur-sm shadow-xl border border-gray-700 hover:scale-105 hover:border-gray-400 duration-300"
        >
          <h2 class="text-xl font-semibold capitalize text-blue-300">
            Voltar para a página inicial
          </h2>
        </RouterLink>
      </div>
    </template>
  </BaseLayout>
</template>
<script setup>
import BaseLayout from "@/components/layouts/BaseLayout.vue";
</script>
