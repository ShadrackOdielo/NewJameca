<template>
    <div class="w-screen flex gap-4 flex-row min-h-screen ">
        <SideBar />
    <UCard :ui="{}" class="flex-1 flex flex-col mr-4 py-2 gap-4">
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