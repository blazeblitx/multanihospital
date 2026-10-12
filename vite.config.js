import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: 'outputs',
    emptyOutDir: false,
    lib: {
      entry: 'src/pattern-waves-entry.jsx',
      name: 'MultaniSiteComponents',
      formats: ['iife'],
      fileName: () => 'site-components.js',
      cssFileName: 'site-components'
    }
  }
});
