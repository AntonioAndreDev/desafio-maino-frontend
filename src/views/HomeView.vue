<script setup>
import {useApi} from "../../composables/useApi.js";
import {onMounted} from "vue";

const {data, fetchData} = useApi('')

onMounted(async () => {
    await fetchData('/pokemon')

    console.log(data.value)
})
</script>

<template>
    <main>
        <h1 class="text-3xl">Hello Mainô!</h1>
    </main>
</template>
