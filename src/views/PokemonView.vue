<template>
  <BaseLayout>
    <template #header>
      <TheHeader
        v-if="!loading"
        :error="error"
        :pokemonId="pokemonId"
        :pokemonDetailsData="pokemonDetailsData"
      />
    </template>

    <template #default>
      <div v-if="!loading">
        <div v-if="pokemonDetailsData" class="space-y-12">
          <PokemonSprites :pokemon-details-data="pokemonDetailsData" />

          <PokemonMoves :pokemon-details-data="pokemonDetailsData" />

          <PokemonEvolutionChain
            v-if="pokemonEvolutionChain"
            :pokemon-evolution-chain="pokemonEvolutionChain"
          />

          <PokemonGames :pokemon-details-data="pokemonDetailsData" />
        </div>
      </div>

      <Loading v-if="loading" />

      <GenericErrorMessage v-if="error" :errorMessage="error" />
    </template>
  </BaseLayout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useApi } from "@/composables/useApi.js";
import { onMounted } from "vue";
import BaseLayout from "@/components/layouts/BaseLayout.vue";
import Loading from "@/components/Loading.vue";
import GenericErrorMessage from "@/components/GenericErrorMessage.vue";
import TheHeader from "@/components/pokemon/TheHeader.vue";
import PokemonSprites from "@/components/pokemon/PokemonSprites.vue";
import PokemonMoves from "@/components/pokemon/PokemonMoves.vue";
import PokemonEvolutionChain from "@/components/pokemon/PokemonEvolutionChain.vue";
import PokemonGames from "@/components/pokemon/PokemonGames.vue";

const route = useRoute();
const pokemonId = route.params.id;

const {
  fetchData: fetchPokemonDetails,
  data: pokemonDetailsData,
  loading,
  error,
} = useApi();

const { fetchData: fetchPokemonSpecies, data: pokemonSpeciesData } = useApi();

const { fetchData: fetchPokemonEvolutionChain, data: pokemonEvolutionChain } =
  useApi();

onMounted(async () => {
  await fetchPokemonDetails(`/pokemon/${pokemonId}`);

  if (pokemonDetailsData.value) {
    await fetchPokemonSpecies(`/pokemon-species/${pokemonId}`);

    if (pokemonSpeciesData.value) {
      const evolutionChainUrl = pokemonSpeciesData.value.evolution_chain.url;
      const evolutionChainId = evolutionChainUrl
        .split("/")
        .filter(Boolean)
        .pop();
      await fetchPokemonEvolutionChain(`/evolution-chain/${evolutionChainId}`);
    }
  }
});
</script>
