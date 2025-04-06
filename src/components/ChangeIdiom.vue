<template>
  <select
    v-model="selectedIdiom"
    id="idiom_select"
    name="idiom_select"
    @change="updateIdiom"
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  >
    <option v-for="idiom in idioms" :key="idiom.id" :value="idiom.id">
      {{ idiom.name }}
    </option>
  </select>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const storedLocale = useStorage("selectedLocale", "pt_BR");
const { locale } = useI18n();

const selectedIdiom = ref(storedLocale.value);

const idioms = ref([
  { id: "en_US", name: "English" },
  { id: "pt_BR", name: "Português" },
  { id: "es", name: "Español" },
]);

const updateIdiom = () => {
  storedLocale.value = selectedIdiom.value;
  locale.value = selectedIdiom.value;
};

onMounted(() => {
  const storedIdiom = localStorage.getItem("selectedLocale");
  if (storedIdiom) {
    selectedIdiom.value = storedIdiom;
    locale.value = storedIdiom;
  }
});
</script>
