<template>
  <BaseLayout>
    <template #header>
      <TheHeader @search-pokemons="searchPokemons" />
    </template>

    <template #default>
      <div
        :class="[
          'grid gap-4',
          pokemons.length === 1
            ? 'grid-cols-1'
            : 'lg:grid-cols-3 md:grid-cols-2',
        ]"
      >
        <RouterLink
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          :to="{ name: 'pokemon', params: { id: pokemon.id } }"
          class="bg-gray-800/50 rounded-2xl md:p-6 p-4 backdrop-blur-sm shadow-xl border border-gray-700 hover:scale-105 hover:border-gray-400 duration-300"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold capitalize text-blue-300">
              {{ pokemon.name }}
            </h2>
            <span
              class="bg-gray-800 px-4 py-2 rounded-full text-blue-300 font-mono"
            >
              #{{ pokemon.id }}
            </span>
          </div>

          <div
            class="mt-2 bg-gray-700/40 px-4 py-2 rounded-lg flex flex-col gap-y-2"
          >
            <div class="text-sm">
              <span class="font-medium"
                >Espécie: <span class="capitalize">{{ pokemon.species }}</span>
              </span>
            </div>

            <div class="mt-1 flex items-center gap-1.5">
              <span class="text-sm font-medium">Tipos:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="type in pokemon.types"
                  :key="type"
                  class="bg-indigo-600/50 py-1 px-4 rounded-lg text-sm transition-colors"
                >
                  {{ type }}
                </span>
              </div>
            </div>
          </div>
        </RouterLink>

        <GenericErrorMessage
          v-if="errorMessage"
          :error-message="errorMessage"
        />
      </div>

      <Loading v-if="loading || detailsLoading" />
    </template>
  </BaseLayout>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { useApi } from "@/composables/useApi.js";
import BaseLayout from "@/components/layouts/BaseLayout.vue";
import Loading from "@/components/Loading.vue";
import TheHeader from "@/components/home/TheHeader.vue";
import GenericErrorMessage from "@/components/GenericErrorMessage.vue";

const { data: allPokemonsData, fetchData: listAllPokemons, loading } = useApi();
const pokemons = ref([]);
const nextUrl = ref(null);
const detailsLoading = ref(false);
const errorMessage = ref("");

const extractPokemonId = (url) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 2];
};

const fetchPokemonDetails = async (pokemon) => {
  const { fetchData: fetchDetails, data: detailsData } = useApi();

  let id = pokemon.id;

  if (pokemon.url) {
    id = extractPokemonId(pokemon.url);
  }

  await fetchDetails(`/pokemon/${id}`);

  if (detailsData.value) {
    pokemon.id = id;
    pokemon.types = detailsData.value.types.map((t) => t.type.name);

    const { fetchData: fetchSpecies, data: speciesData } = useApi();
    await fetchSpecies(`/pokemon-species/${id}`);

    if (speciesData.value) {
      pokemon.species = speciesData.value.name;
    }

    return pokemon;
  }
};

const loadAndAppendPokemons = async (url) => {
  await listAllPokemons(url);
  if (allPokemonsData.value) {
    const newPokemons = allPokemonsData.value.results;

    detailsLoading.value = true;
    try {
      const pokemonsWithDetails = await Promise.all(
        newPokemons.map((pokemon) => fetchPokemonDetails(pokemon)),
      );

      pokemons.value.push(...pokemonsWithDetails);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      detailsLoading.value = false;
    }

    nextUrl.value = allPokemonsData.value.next?.replace(
      "https://pokeapi.co/api/v2",
      "",
    );
  }
};

const handleScroll = () => {
  const scrollBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  if (
    scrollBottom &&
    nextUrl.value &&
    !loading.value &&
    !detailsLoading.value
  ) {
    loadAndAppendPokemons(nextUrl.value);
  }
};

const renderPokemonByNameOrId = async (searchQuery) => {
  const { fetchData: showPokemon, data: pokemonData } = useApi();
  await showPokemon(`/pokemon/${searchQuery.toLowerCase()}`);

  if (pokemonData.value) {
    pokemons.value = await Promise.all([
      fetchPokemonDetails(pokemonData.value),
    ]);
    errorMessage.value = "";
  } else {
    pokemons.value = [];
    errorMessage.value = "Pokémon não encontrado";
  }
};

const renderPokemonBySpecie = async (searchQuery) => {
  const { fetchData: showPokemon, data: pokemonData } = useApi();
  await showPokemon(`/pokemon-species/${searchQuery.toLowerCase()}`);

  if (pokemonData.value) {
    pokemons.value = await Promise.all([
      fetchPokemonDetails(pokemonData.value),
    ]);
    errorMessage.value = "";
  } else {
    pokemons.value = [];
    errorMessage.value = "Pokémon não encontrado";
  }
};

const renderPokemonByType = async (searchQuery) => {
  const { fetchData: showPokemon, data: pokemonData } = useApi();
  await showPokemon(`/type/${searchQuery.toLowerCase()}`);

  if (pokemonData.value) {
    pokemons.value = await Promise.all(
      pokemonData.value.pokemon.map((p) => fetchPokemonDetails(p.pokemon)),
    );
    errorMessage.value = "";
  } else {
    pokemons.value = [];
    errorMessage.value = "Pokémon não encontrado";
  }
};

const searchPokemons = async (searchQuery, filter) => {
  if (searchQuery === "") {
    pokemons.value = [];
    errorMessage.value = "";
    await loadAndAppendPokemons("/pokemon?offset=0&limit=50");
    return;
  }

  if (filter === "id") {
    await renderPokemonByNameOrId(searchQuery);
    return;
  }

  if (filter === "nome") {
    await renderPokemonByNameOrId(searchQuery);
    return;
  }

  if (filter === "especie") {
    await renderPokemonBySpecie(searchQuery);
    return;
  }

  if (filter === "tipo") {
    await renderPokemonByType(searchQuery);
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
