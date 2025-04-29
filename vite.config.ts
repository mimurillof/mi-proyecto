import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Hot Module Replacement (actualización en tiempo real)
    hmr: {
      overlay: true
    },
    // Configuración para archivos que Vite debe observar
    watch: {
      usePolling: true,
      include: ['**/*.html', '**/*.css', '**/*.js', '**/*.ts', '**/*.tsx', '**/*.json']
    }
  },
  build: {
    // Rollup options para múltiples puntos de entrada
    rollupOptions: {
      input: {
        main: 'index.html',
        inicio: 'public/pages/inicio.html',
        dashboard: 'public/pages/dashboard.html',
        reportes: 'public/pages/reportes.html',
        portafolio: 'public/pages/portafolio.html',
        mercado: 'public/pages/mercado.html',
        ai_agent: 'public/pages/ai_agent.html'
      }
    }
  }
});
