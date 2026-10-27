import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// VITE_BASE_PATH is set by the GitHub Actions workflow for GitHub Pages deployment
const base = process.env.VITE_BASE_PATH ?? '/'

// ── Plugin de API admin (só activo em dev) ──────────────────────────────────
// Permite ao admin escrever directamente nos ficheiros JSON de dados sem sair da app.
function adminApiPlugin() {
  const DATA_DIR = path.resolve(__dirname, 'src/app/data')
  const ALLOWED  = new Set(['techniques', 'hanbeon', 'hoshin', 'sequences', 'poomsae'])

  return {
    name: 'admin-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/admin/')) return next()

        res.setHeader('Content-Type', 'application/json')
        const reject = (status: number, error: string) => {
          res.statusCode = status
          res.end(JSON.stringify({ error }))
        }

        // Só pedidos POST JSON da própria app — bloqueia escritas vindas de outros sites
        // (exigir application/json obriga o browser a fazer preflight CORS, que falha aqui).
        if (req.method !== 'POST') return reject(405, 'Método não permitido.')
        if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) {
          return reject(415, 'Content-Type tem de ser application/json.')
        }
        const origin = req.headers.origin
        if (origin && URL.parse(origin)?.host !== req.headers.host) return reject(403, 'Origem não permitida.')

        // Parse body
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk)
        let body: any = {}
        try { body = JSON.parse(Buffer.concat(chunks).toString()) } catch { /**/ }

        try {
          if (req.url === '/api/admin/save') {
            const { resource, data } = body
            if (!ALLOWED.has(resource)) return reject(400, 'Recurso inválido.')
            if (!Array.isArray(data)) return reject(400, 'Dados inválidos (esperada uma lista).')
            const filePath = path.join(DATA_DIR, `${resource}.json`)
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
            res.end(JSON.stringify({ ok: true }))

          } else {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'Endpoint não encontrado.' }))
          }
        } catch (err: any) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(err?.message ?? err) }))
        }
      })
    }
  }
}

export default defineConfig({
  base,
  plugins: [
    adminApiPlugin(),
    react(),
    tailwindcss(),
    // PWA: instalável no telemóvel e funciona offline (pré-carrega a app e todas as imagens)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Taekwondo',
        short_name: 'Taekwondo',
        description: 'Terminologia, técnicas e poomsae de Taekwondo.',
        lang: 'pt-PT',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1C2128',
        theme_color: '#1C2128',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] },
          },
        }],
      },
    }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
