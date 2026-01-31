
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    console.log('Checking Prisma Client...');
    const count = await prisma.ordemServico.count({
      where: {
        ano: 2025
      }
    });
    console.log('Success! Count:', count);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
