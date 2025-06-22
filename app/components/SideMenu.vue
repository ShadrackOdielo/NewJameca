<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Toggle the collapsed state of the menu from the parent component


const isCollapsed = useState('side-menu-collapsed', () => false)

const menuItems: NavigationMenuItem[] = [
  {
    title: 'Home',
    icon: 'home',
    to: '/',
  },
  {
    title: 'About',
    icon: 'info',
    to: '/about',
  },
  {
    title: 'Contact',
    icon: 'phone',
    to: '/contact',
  },
]
</script>
<template>
    <UCard>
        <template #header>
            <UButton
                icon="i-lucide-menu"
                variant="ghost"
                @click="isCollapsed = !isCollapsed"
            />
            <span class="text-lg font-semibold">Menu</span>
        </template>

    <UNavigationMenu :items="menuItems" orientation="vertical" :collapsed="isCollapsed"/>
        <template #footer>
            <UButton
                icon="i-lucide-settings"
                variant="ghost"
                @click="isCollapsed = !isCollapsed"
            />
        </template>
    </UCard>

</template>