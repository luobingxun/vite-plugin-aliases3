import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import aliases from '../dist/index.mjs';

export default defineConfig({
  plugins: [aliases(), react()]
});
