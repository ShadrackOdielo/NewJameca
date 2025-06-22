<script setup lang="ts">
import SideMenu from './SideMenu.vue';

</script>

<template>
  <USlideover side="left" title="Slideover with side">
    <UButton icon="i-lucide-menu" color="neutral" variant="subtle" />

<template #body>
<SideMenu/>    
</template>
  </USlideover>
</template>
