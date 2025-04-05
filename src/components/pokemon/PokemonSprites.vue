<template>
  <div
    class="bg-gray-800/50 rounded-2xl md:p-6 p-4 backdrop-blur-sm shadow-xl border border-gray-700"
  >
    <h2 class="text-2xl font-semibold mb-6 text-blue-300">Sprites</h2>
    <div class="flex md:flex-row-reverse flex-col-reverse justify-center">
      <div v-for="(sprite, key) in pokemonDetailsData.sprites" :key="key">
        <div
          v-if="
            [
              'back_default',
              'front_shiny',
              'front_default',
              'back_shiny',
            ].includes(key) && sprite
          "
          class="bg-gray-900/60 m-4 rounded-lg p-4 flex flex-col items-center hover:bg-indigo-900/40 group transition-all duration-300 transform hover:scale-105"
        >
          <img
            class="size-44 object-contain filter drop-shadow-lg"
            :src="sprite"
            :alt="`Sprite ${key}`"
          />
          <span
            class="mt-2 text-xs uppercase tracking-wider text-gray-400 group-hover:text-blue-300 transition-colors"
          >
            {{ formatSpriteKey(key) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["pokemonDetailsData"]);

const formatSpriteKey = (key) => {
  const parts = key.split("_");
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
</script>
