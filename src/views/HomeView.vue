<template>
  <BaseLayout>
    <template #header>
      <TheHeader @search-pokemons="searchPokemons" />
    </template>

    <template #default>
      <PokemonsList :pokemons="pokemons" />

      <GenericErrorMessage v-if="errorMessage" :error-message="errorMessage" />

      <Loading v-if="loading || detailsLoading || searchLoading" />
    </template>
  </BaseLayout>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import BaseLayout from "@/components/layouts/BaseLayout.vue";
import Loading from "@/components/Loading.vue";
import TheHeader from "@/components/home/TheHeader.vue";
import GenericErrorMessage from "@/components/GenericErrorMessage.vue";
import PokemonsList from "@/components/home/PokemonsList.vue";
import { usePokemonsRequestStore } from "@/stores/pokemonsRequest.js";
import { storeToRefs } from "pinia";

const { loadAndAppendPokemons, searchPokemons } = usePokemonsRequestStore();

const {
  pokemons,
  loading,
  detailsLoading,
  searchLoading,
  errorMessage,
  nextUrl,
  isSearchMode,
} = storeToRefs(usePokemonsRequestStore());

const handleScroll = () => {
  const scrollBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  if (
    scrollBottom &&
    nextUrl.value &&
    !loading.value &&
    !detailsLoading.value &&
    !searchLoading.value &&
    !isSearchMode.value
  ) {
    loadAndAppendPokemons(nextUrl.value);
  }
};

onMounted(async () => {
  await loadAndAppendPokemons("/pokemon?offset=0&limit=50");

  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
