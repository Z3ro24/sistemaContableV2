import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Parse .env file manually
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match) {
      databaseUrl = match[1];
    }
  }
}

if (!databaseUrl) {
  databaseUrl = 'postgresql://postgres:password@localhost:5432/login_register?schema=public';
}

const pool = new Pool({
  connectionString: databaseUrl,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Previred catalog data...');

  // 1. AFPs
  const afps = [
    { name: 'CAPITAL', previredCode: '05', commissionRate: 1.44 },
    { name: 'CUPRUM', previredCode: '03', commissionRate: 1.44 },
    { name: 'HABITAT', previredCode: '08', commissionRate: 1.27 },
    { name: 'MODELO', previredCode: '29', commissionRate: 0.58 },
    { name: 'PLANVITAL', previredCode: '02', commissionRate: 1.16 },
    { name: 'PROVIDA', previredCode: '09', commissionRate: 1.45 },
    { name: 'UNO', previredCode: '33', commissionRate: 0.49 },
  ];

  for (const afp of afps) {
    const existing = await prisma.afp.findFirst({ where: { name: afp.name } });
    if (!existing) {
      await prisma.afp.create({ data: afp });
    }
  }

  // 2. Health Institutions (Fonasa & Isapres)
  const healthInstitutions = [
    { name: 'FONASA', previredCode: '01', isIsapre: false },
    { name: 'ISAPRE BANMÉDICA', previredCode: '02', isIsapre: true },
    { name: 'ISAPRE COLMENA', previredCode: '03', isIsapre: true },
    { name: 'ISAPRE CONSALUD', previredCode: '04', isIsapre: true },
    { name: 'ISAPRE CRUZ BLANCA', previredCode: '05', isIsapre: true },
    { name: 'ISAPRE NUEVA MASVIDA', previredCode: '06', isIsapre: true },
    { name: 'ISAPRE VIDA TRES', previredCode: '07', isIsapre: true },
  ];

  for (const health of healthInstitutions) {
    const existing = await prisma.healthInstitution.findFirst({ where: { name: health.name } });
    if (!existing) {
      await prisma.healthInstitution.create({ data: health });
    }
  }

  // 3. Contract Types
  const contractTypes = [
    { name: 'Indefinido', dtCode: '01', afcWorkerDiscount: true },
    { name: 'Plazo Fijo', dtCode: '02', afcWorkerDiscount: false },
    { name: 'Por Obra o Faena', dtCode: '03', afcWorkerDiscount: false },
  ];

  for (const ct of contractTypes) {
    const existing = await prisma.contractType.findFirst({ where: { name: ct.name } });
    if (!existing) {
      await prisma.contractType.create({ data: ct });
    }
  }

  // 4. Banks
  const banks = [
    { name: 'Banco de Chile / Edwards', sbifCode: '001' },
    { name: 'Banco del Estado de Chile (BancoEstado)', sbifCode: '012' },
    { name: 'Banco Santander Chile', sbifCode: '037' },
    { name: 'Banco de Crédito e Inversiones (BCI)', sbifCode: '016' },
    { name: 'Banco Itaú Chile', sbifCode: '039' },
    { name: 'Scotiabank Chile', sbifCode: '014' },
    { name: 'Banco BICE', sbifCode: '028' },
    { name: 'Banco Security', sbifCode: '049' },
    { name: 'Banco Falabella', sbifCode: '051' },
    { name: 'Banco Ripley', sbifCode: '053' },
    { name: 'Banco Consorcio', sbifCode: '055' },
    { name: 'Tenpo Prepago / Mercado Pago / Coopeuch', sbifCode: '099' },
  ];

  for (const bank of banks) {
    const existing = await prisma.bank.findFirst({ where: { name: bank.name } });
    if (!existing) {
      await prisma.bank.create({ data: bank });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
