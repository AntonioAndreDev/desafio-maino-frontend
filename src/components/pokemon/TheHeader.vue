<template>
  <div
    class="flex md:flex-row flex-col justify-between md:items-center mb-8 gap-y-4 flex-wrap"
  >
    <div class="flex items-center flex-wrap gap-2">
      <BackButton />
      <h1
        v-if="!error"
        class="md:text-4xl text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase w-fit"
      >
        {{ pokemonDetailsData?.name }}
      </h1>

      <span
        v-if="!error"
        class="bg-gray-800 px-4 py-2 rounded-full text-blue-300 font-mono"
      >
        #{{ pokemonId }}
      </span>
    </div>
    <div class="flex items-center gap-x-2">
      <ChangeIdiom />
    </div>
  </div>
</template>

<script setup>
import BackButton from "@/components/BackButton.vue";
import ChangeIdiom from "@/components/ChangeIdiom.vue";

defineProps(["pokemonId", "pokemonDetailsData", "error"]);
</script>
