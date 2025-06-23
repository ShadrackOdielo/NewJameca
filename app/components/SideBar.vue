<script setup lang="ts">
import SideMenu from './SideMenu.vue';




</script>
<template>
    <UCard class="not-md:hidden max-h-screen overflow-y-auto bg-elevated">
        <SideMenu :is-not-sidebar="false" />
    </UCard>
</template>