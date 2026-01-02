<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <Toaster position="top-right" :duration="3000" rich-colors />
    </ClientOnly>
  </div>
</template>