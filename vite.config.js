import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '127.0.0.1', // Explicitly set the host
    port: 5173,        // Ensure the port matches the one in the error
    strictPort: true,  // Prevent Vite from switching to a different port
    hmr: {
      host: '127.0.0.1', // Ensure HMR uses the correct host
    },
  },
});