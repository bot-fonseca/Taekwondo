import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// ── Plugin de API admin (só activo em dev) ──────────────────────────────────
// Permite ao admin escrever directamente nos ficheiros JSON de dados e fazer
// git commit + push sem sair da app.
function adminApiPlugin() {
  const DATA_DIR = path.resolve(__dirname, 'src/app/data')
  const ALLOWED  = new Set(['techniques', 'hanbeon', 'hoshin', 'sequences'])

  return {
    name: 'admin-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/admin/')) return next()

        // Parse body
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk)
        let body: any = {}
        try { body = JSON.parse(Buffer.concat(chunks).toString()) } catch { /**/ }

        res.setHeader('Content-Type', 'application/json')

        try {
          if (req.url === '/api/admin/save') {
            const { resource, data } = body
            if (!ALLOWED.has(resource)) {
              res.statusCode = 400
              return res.end(JSON.stringify({ error: 'Recurso inválido.' }))
            }
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
  plugins: [
    figmaAssetResolver(),
    adminApiPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
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
