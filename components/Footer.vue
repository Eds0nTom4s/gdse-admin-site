<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Copyright -->
        <div class="text-sm text-gray-600 order-2 sm:order-1">
          © {{ currentYear }} <span class="font-semibold text-[var(--brand-green)]">Grupo Desportivo Sagrada Esperança</span>. Todos os direitos reservados.
        </div>
        
        <!-- Links -->
        <div class="flex items-center gap-6 text-sm text-gray-600 order-1 sm:order-2">
          <a 
            href="https://gdse.ao" 
            target="_blank" 
            rel="noopener noreferrer"
            class="hover:text-[var(--brand-green)] transition-colors duration-200"
          >
            Site Oficial
          </a>
          <span class="text-gray-300">|</span>
          <span class="text-gray-500">
            Painel Administrativo
          </span>
          <span class="text-gray-300">|</span>
          <span class="text-gray-500">
            v{{ appVersion }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
const appVersion = '0.1.0' // Sincronizado com package.json
</script>
