<script setup lang="ts">
import SideMenu from './SideMenu.vue';

</script>

<template>
  <USlideover side="left" :ui="{content:'w-fit'}" :close-on-click-outside="true">
    <UButton icon="i-lucide-menu" color="neutral" variant="subtle" />

<template #body>
<SideMenu :is-not-sidebar="true"/>    
</template>
  </USlideover>
</template>
