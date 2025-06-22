<template>
    <div class="w-screen flex-row ">
        <SideBar />
    <UCard :ui="{body: 'w-full min-h-screen flex items-center justify-center'}">
        <template #header>
            <AppHeader />
        </template>
        <slot />
        <template #footer>
            <p>(c) 2025</p>
        </template>
    </UCard>
    </div>
</template>