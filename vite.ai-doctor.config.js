import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: 'outputs',
    emptyOutDir: false,
    lib: {
      entry: 'src/ai-doctor-icon-entry.jsx',
      name: 'MultaniAIDoctorIcon',
      formats: ['iife'],
      fileName: () => 'ai-doctor-icon.js',
      cssFileName: 'ai-doctor-icon'
    }
  }
});
