<template>
  <div class="flex justify-between items-center mb-8 gap-y-4 flex-wrap">
    <div class="flex items-center gap-x-2">
      <BackButton />
      <h1
        v-if="!error"
        class="md:text-4xl text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase w-fit"
      >
        {{ pokemonDetailsData?.name }}
      </h1>
    </div>
    <span
      v-if="!error"
      class="bg-gray-800 px-4 py-2 rounded-full text-blue-300 font-mono"
    >
      #{{ pokemonId }}
    </span>
  </div>
</template>

<script setup>
import BackButton from "@/components/BackButton.vue";

defineProps(["pokemonId", "pokemonDetailsData", "error"]);
</script>
