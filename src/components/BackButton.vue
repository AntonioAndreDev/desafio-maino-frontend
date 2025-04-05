<template>

    <div class="flex items-center">
        <button @click="router.back()"
                class="bg-indigo-600/50 hover:bg-indigo-600 md:px-4 md:py-2 px-2 py-1 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-x-2 font-medium"
        >
            <Icon class="size-5" icon="carbon:return"/>
            Voltar
        </button>
    </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {Icon} from "@iconify/vue";

const router = useRouter();
</script>
