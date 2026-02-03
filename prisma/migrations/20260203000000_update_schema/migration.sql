-- CreateEnum
CREATE TYPE "TipoDesconto" AS ENUM ('VALOR', 'PORCENTAGEM');

-- AlterEnum
BEGIN;
CREATE TYPE "StatusOrdemServico_new" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');
ALTER TABLE "public"."OrdemServico" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "OrdemServico" ALTER COLUMN "status" TYPE "StatusOrdemServico_new" USING ("status"::text::"StatusOrdemServico_new");
ALTER TYPE "StatusOrdemServico" RENAME TO "StatusOrdemServico_old";
ALTER TYPE "StatusOrdemServico_new" RENAME TO "StatusOrdemServico";
DROP TYPE "public"."StatusOrdemServico_old";
ALTER TABLE "OrdemServico" ALTER COLUMN "status" SET DEFAULT 'EM_ANDAMENTO';
COMMIT;

-- AlterTable
ALTER TABLE "OrdemServico" DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
ADD COLUMN     "ano" INTEGER NOT NULL,
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataFinalizacao" TIMESTAMP(3),
ADD COLUMN     "defeitoRelatado" TEXT,
ADD COLUMN     "desconto" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "numero" INTEGER NOT NULL,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "tipoDesconto" "TipoDesconto" NOT NULL DEFAULT 'VALOR',
ADD COLUMN     "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "valorPecas" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "valorServicos" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "valorSubtotal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "veiculoCombustivel" TEXT,
ADD COLUMN     "veiculoKm" DOUBLE PRECISION,
ADD COLUMN     "veiculoObservacoes" TEXT,
ALTER COLUMN "status" SET DEFAULT 'EM_ANDAMENTO';

-- AlterTable
ALTER TABLE "Veiculo" ALTER COLUMN "ano" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrdemServico_numero_ano_key" ON "OrdemServico"("numero", "ano");
