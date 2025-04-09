<template>
  <div
    v-if="pokemonDetailsData.game_indices"
    class="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl border border-gray-700"
  >
    <h2 class="text-2xl font-semibold mb-6 text-blue-300">
      {{ $t("aparicoes_em_jogos") }}
    </h2>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
    >
      <div
        v-for="(game, index) in pokemonDetailsData.game_indices"
        :key="index"
        class="bg-gray-700/40 px-3 py-2 rounded-lg text-center hover:bg-indigo-800/40 transition-colors"
      >
        <p class="capitalize text-sm">
          {{ game.version.name.replace("-", " ") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["pokemonDetailsData"]);
</script>
