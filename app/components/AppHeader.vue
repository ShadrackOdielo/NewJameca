<script setup lang="ts">

</script>
<template>
    <div class="flex flex-row justify-between">
        <MenuSlideover />
        <UButton
            icon="i-lucide-bell"
            color="neutral"
            variant="subtle"
            />
        <UButton
            icon="i-lucide-user"
            color="neutral"
            variant="subtle"
            label="Profile settings"
            />
        <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="subtle"
            label="Logout"
            />
        <UButton
            icon="i-lucide-settings"
            color="neutral"
            variant="subtle"
            label="Settings"
            />
    </div>

</template>