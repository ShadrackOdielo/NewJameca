<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Toggle the collapsed state of the menu from the parent component
// check if the parent component has a prop called `isNotSidebar` else use the default value of false
const isNotSidebar = defineProps<{
    isNotSidebar: boolean
}>()


const isCollapsed = useState('side-menu-collapsed', () => false)

const menuItems = ref<NavigationMenuItem[][]>([
    [
        {
            slot: 'header',
            label: 'Jameca Dashboard',
            avatar: {
                src: '/logo.png',
                alt: 'User Avatar',
            },
            onSelect: () => {
                if (isNotSidebar) {
                    isCollapsed.value = !isCollapsed.value
                }
                else {
                    isCollapsed.value = false
                }
            },
        }
    ],
    [
        {
            label: 'Dashboard',
            icon: 'i-lucide-grid',
            to: '/'
        },
        {
            label: 'analytics',
            icon: 'i-lucide-bar-chart-2',
            to: '/analytics',
        },
        {
           label: 'Reports',
            icon: 'i-lucide-file-text',
            to: '/reports',
        },

    ],
    [
        {
            label: 'Blog',
            icon: 'i-lucide-edit',
            to: '/posts',
            defaultOpen: true,
            children: [
                {
                    label: 'All Posts',
                    icon: 'i-lucide-list',
                    to: '/posts',
                },
                
                {
                    label: 'Add Post',
                    icon: 'i-lucide-plus-circle',
                    to: '/posts/create',
                },
            ],
        }
    ],
    [
        {
            label: 'Products',
            icon: 'i-lucide-box',
            to: '/products',
            defaultOpen: true,
            children: [
                {
                    label: 'Inventory',
                    icon: 'i-lucide-archive',
                    to: '/products/inventory',
                },
                {
                    label: 'Categories',
                    icon: 'i-lucide-tag',
                    to: '/products/categories',
                },
                {
                    label: 'Brands/schools',
                    icon: 'i-simple-icons-shopify',
                    to: '/products/schools',
                },
                {
                    label: 'Add Product',
                    icon: 'i-lucide-plus-circle',
                    to: '/products/create',
                },

            ],
            
        },
        
        {
            label: 'Orders',
            icon: 'i-lucide-shopping-cart',
            to: '/orders',
            defaultOpen: true,
            children: [
                {
                    label: 'Pending Orders',
                    icon: 'i-lucide-clock',
                    to: '/orders?pending',
                },
                {
                    label: 'Completed Orders',
                    icon: 'i-lucide-check-circle',
                    
                    to: '/orders?completed',
                },
                {
                    label: 'Cancelled Orders',
                    icon: 'i-lucide-x-circle',
                    to: '/orders?cancelled',
                },
            ],
        },
        {
            label: 'Customers',
            icon: 'i-lucide-users',
            to: '/users',
            defaultOpen: true,
            children: [
                {
                    label: 'Customer List',
                    icon: 'i-lucide-list',
                    to: '/users',
                },
                {
                    label: 'Customer Groups',
                    icon: 'i-lucide-users',
                    to: '/users',
                },
                {
                    label: 'Add Customer',
                    icon: 'i-lucide-plus-circle',
                    to: '/users/add',
                },
            ],
        }

    ],
    
    [
        {
            label: 'Settings',
            icon: 'i-lucide-settings',
            to: '/settings',
        },
                {
                    label: 'Profile',
                    icon: 'i-lucide-user',
                    to: '/profile',
                },
                
                {
                    label: 'Notifications',
                    icon: 'i-lucide-bell',
                    to: '/notifications',
                },
        {
            label: 'Help & Support',
            icon: 'i-lucide-help-circle',
            to: '/help',
        },
        {
            label: 'Logout',
            icon: 'i-lucide-log-out',
            to: '/logout',
        },

    ],
])
      
</script>
<template>       
    <UNavigationMenu 
    :items="menuItems"
     orientation="vertical" 
    :collapsed="isCollapsed"
    tooltip
    popover
    />
    
        

</template>