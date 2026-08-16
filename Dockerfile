# 1. Etap bazowy
FROM node:22-alpine AS base

# 2. Etap instalacji zależności
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 3. Etap budowania aplikacji
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Budujemy aplikację Next.js
RUN npm run build

# 4. Etap produkcyjny (uruchomieniowy)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Tworzymy bezpiecznego użytkownika bez uprawnień roota
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Ustawiamy uprawnienia dla cache'u
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Kopiujemy zoptymalizowane pliki z trybu "standalone"
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]