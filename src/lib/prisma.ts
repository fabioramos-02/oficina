import { PrismaClient } from '@prisma/client'

/**
 * Tipagem do objeto global para evitar múltiplas instâncias
 * do Prisma Client em ambiente de desenvolvimento.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

/**
 * Instância única do Prisma Client.
 * Em desenvolvimento, reutiliza a instância global.
 * Em produção, cria uma nova instância.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

/**
 * Evita múltiplas conexões com o banco
 * durante hot reload do Next.js em desenvolvimento.
 */
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
