<script setup lang="ts">

const lang = useI18n();
const items = ref([
    {label: 'English',value: 'en', icon: 'i-lucide-globe'},
    {label: 'Français',value: 'fr', icon: 'i-openmoji-flag-france'},
    {label: 'Deutsch',value: 'de', icon: 'i-openmoji-flag-germany'}

])
const value = ref(lang.locale.value);
</script>
<template>
    <ClientOnly>
    <USelect v-model="value" :items="items" icon="i-lucide-globe" class="w-32"/>
</ClientOnly>
</template>