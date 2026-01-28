import { prisma } from '../lib/prisma';
import { Licenca, StatusLicenca } from '@prisma/client';

/**
 * Cria uma nova licença no banco de dados.
 * @returns A licença criada.
 */
export async function criarLicenca(): Promise<Licenca> {
  const dataFim = new Date();
  dataFim.setMonth(dataFim.getMonth() + 1); // 30 dias de trial/inicial

  return prisma.licenca.create({
    data: {
      status: 'ATIVA',
      dataInicio: new Date(),
      dataFim: dataFim,
    },
  });
}

/**
 * Busca uma licença pelo ID.
 * @param id ID da licença.
 */
export async function buscarLicencaPorId(id: string): Promise<Licenca | null> {
  return prisma.licenca.findUnique({
    where: { id },
  });
}
