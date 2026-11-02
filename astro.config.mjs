import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  security: {
    checkOrigin: false,
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