import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/filter-sort-ctrl.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  }
})
