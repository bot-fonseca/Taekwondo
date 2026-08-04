# Taekwondo Terminology Reference App

Aplicação mobile-first de referência de terminologia de Taekwondo com técnicas pesquisáveis, passos de Poomsae, prática organizada por cinto e terminologia geral.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [pnpm](https://pnpm.io/) v9 ou superior

```bash
npm install -g pnpm
```

---

## Instalação

```bash
git clone https://github.com/bot-fonseca/Taekwondo.git
cd Taekwondo
pnpm install
```

---

## Desenvolvimento

```bash
pnpm dev
```

Abre http://localhost:5173 no browser.

> **Nota:** O servidor de desenvolvimento inclui uma API admin (`/api/admin/save`) que permite guardar alterações directamente nos ficheiros JSON de dados. Esta API só está disponível em modo `dev`.

---

## Build de produção

```bash
pnpm build
```

Os ficheiros compilados ficam em `dist/`. Para servir localmente:

```bash
pnpm dlx serve dist
```

---

## Deploy no Linux

### Opção A — Servidor com Node.js (Nginx + static files)

```bash
# 1. Build
pnpm build

# 2. Copiar dist/ para o servidor web
#    Ex: Nginx a servir /var/www/taekwondo
cp -r dist/* /var/www/taekwondo/

# 3. Configurar Nginx (exemplo)
# /etc/nginx/sites-available/taekwondo
# server {
#     listen 80;
#     root /var/www/taekwondo;
#     index index.html;
#     location / { try_files $uri $uri/ /index.html; }
# }
```

### Opção B — Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

`nginx.conf` mínimo para SPA:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
docker build -t taekwondo-app .
docker run -p 8080:80 taekwondo-app
```

---

## Modo Admin

O PIN por defeito é `1234`. Para activar o modo admin:

- **Mobile:** botão cadeado no canto inferior direito (acima da navegação)
- **Desktop:** botão "Admin" na parte inferior da barra lateral

Em modo admin é possível criar, editar e eliminar técnicas, poomsaes, exercícios de prática e conteúdo por cinto. As alterações são guardadas nos ficheiros JSON em `src/app/data/` via API do servidor de desenvolvimento.

---

## Estrutura relevante

```
src/app/data/         # Dados editáveis (JSON)
public/images/        # Imagens de técnicas, poomsaes e pontapés
src/app/components/   # Componentes React
src/app/context/      # AdminContext, ThemeContext
src/app/hooks/        # Hooks de dados e utilitários
```

---

## Compatibilidade Linux

O projecto usa `pnpm-workspace.yaml` com suporte declarado para `linux` (glibc e musl). Para Alpine Linux adiciona `musl` se necessário:

```yaml
supportedArchitectures:
  libc:
    - glibc
    - musl
    - unknown
```
