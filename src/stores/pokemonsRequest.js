import { useApi } from "@/composables/useApi";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import {
  renderPokemonByNameOrId,
  renderPokemonBySpecie,
  renderPokemonByType,
} from "@/utils/pokemonSearchUtils.js";

export const usePokemonsRequestStore = defineStore("pokemonsRequest", () => {
  const { t } = useI18n();
  const {
    data: allPokemonsData,
    fetchData: listAllPokemons,
    loading,
  } = useApi();
  const pokemons = ref([]);
  const detailsLoading = ref(false);
  const nextUrl = ref(null);
  const searchLoading = ref(false);
  const errorMessage = ref("");
  const isSearchMode = ref(false);

  const extractPokemonId = (url) => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 2];
  };

  const loadAndAppendPokemons = async (url) => {
    await listAllPokemons(url);
    if (allPokemonsData.value) {
      // Renderiza além do limite de 1025 pokémons (id)
      // const newPokemons = allPokemonsData.value.results;
      const newPokemons = allPokemonsData.value.results
        .map((pokemon) => {
          const id = parseInt(extractPokemonId(pokemon.url));
          return { ...pokemon, id };
        })
        .filter((pokemon) => pokemon.id <= 1025);

      detailsLoading.value = true;
      try {
        const pokemonsWithDetails = await Promise.all(
          newPokemons.map((pokemon) => fetchPokemonDetails(pokemon)),
        );

        pokemons.value.push(...pokemonsWithDetails);
      } finally {
        detailsLoading.value = false;
      }

      nextUrl.value = allPokemonsData.value.next?.replace(
        "https://pokeapi.co/api/v2",
        "",
      );
    }
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

  const searchPokemons = async (searchQuery, filter) => {
    try {
      searchLoading.value = true;
      errorMessage.value = "";
      pokemons.value = [];

      if (searchQuery === "") {
        isSearchMode.value = false;
        await loadAndAppendPokemons("/pokemon?offset=0&limit=50");
        return;
      }

      isSearchMode.value = true;

      let result = { pokemons: [], errorMessage: "" };

      if (filter === "id" || filter === "nome") {
        result = await renderPokemonByNameOrId(
          searchQuery,
          fetchPokemonDetails,
          t,
        );
      }
      if (filter === "especie") {
        result = await renderPokemonBySpecie(
          searchQuery,
          fetchPokemonDetails,
          t,
        );
      }
      if (filter === "tipo") {
        result = await renderPokemonByType(searchQuery, fetchPokemonDetails, t);
      }

      pokemons.value = result.pokemons;
      errorMessage.value = result.errorMessage;
    } finally {
      searchLoading.value = false;
    }
  };

  return {
    pokemons,
    nextUrl,
    loading,
    detailsLoading,
    searchLoading,
    errorMessage,
    isSearchMode,
    loadAndAppendPokemons,
    listAllPokemons,
    searchPokemons,
  };
});
