import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

// Fix for: PrismaClientInitializationError: Using engine type "client" requires either "adapter" or "accelerateUrl"
// Since the project is using adapter-pg, we must use it here too.

const connectionString = process.env.DATABASE_URL;

// Note: The src/lib/prisma.ts seems to use a different signature or maybe I misread it.
// Standard way is using pg Pool.
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const oficinaCount = await prisma.oficina.count();

  if (oficinaCount === 0) {
    console.log('Criando oficina padrão...');
    await prisma.oficina.create({
      data: {
        nomeFantasia: 'Porãmec Car Service',
        razaoSocial: 'MECANICA PORAMEC LTDA',
        cnpj: '14.180.348/0001-12',
        enderecoRua: 'Rua Ceará',
        enderecoNumero: '315',
        enderecoBairro: 'Vila Deputado Aral Moreira',
        enderecoCidade: 'Ponta Porã',
        enderecoEstado: 'MS',
        enderecoCep: '79906-542',
        telefone: '+55 (67) 9646-3339',
        email: 'mecanica.poramec@gmail.com',
        instagram: '@poramec',
        facebook: 'Porãmec',
        descricaoInstitucional: 'Especializado em câmbio automático e injeção eletrônica de veículos nacionais e importados'
      }
    });
    console.log('Oficina padrão criada com sucesso!');
  } else {
    console.log('Oficina já existe.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
