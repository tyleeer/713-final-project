<script setup lang="ts">
</script>

<template>
    <div class="my-auto flex items-center justify-center bg-gradient-to-br px-4 py-8">
        <div class="max-w-md w-full space-y-8 text-center">
            <!-- Error Message -->
            <div class="space-y-4">
                <h1 class="text-5xl font-extrabold text-gray-800 tracking-tight">
                    404
                </h1>
                <h2 class="text-2xl font-semibold text-gray-600">
                    Page Not Found
                </h2>
                <p class="text-gray-500 text-lg">
                    The page you're looking for is not here.
                </p>
            </div>

            <!-- Navigation Options -->
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <router-link :to="{ name: 'home' }"
                    class="btn btn-primary px-6! py-3 text-white! rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Return Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add any additional scoped styles if needed */
.btn {
    text-transform: none;
}
</style>