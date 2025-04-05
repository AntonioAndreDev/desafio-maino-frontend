<template>
  <div
    v-if="errorMessage"
    class="flex flex-col items-center justify-center mt-4 w-full col-span-3 border-l-4 border-red-600 bg-red-200 rounded-xl p-4 shadow-lg"
  >
    <p class="text-red-800 font-medium">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
defineProps(["errorMessage"]);
</script>
