import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  security: {
    checkOrigin: false,
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
  redirects: {
    '/index.html': '/',
    '/about.html': '/about',
    '/services.html': '/services',
    '/templates.html': '/templates',
    '/contact.html': '/contact',
    '/admin.html': '/admin',
    '/reset-password.html': '/reset-password',
  },
});
/*  */