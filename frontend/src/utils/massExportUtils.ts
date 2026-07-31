import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { numberToWordsCLP } from './numberToWords';

// @ts-ignore
import html2pdf from 'html2pdf.js';

export interface PayrollExportData {
  id: number;
  periodYyyyMm: string;
  baseSalaryAgreed: number | string;
  totalTaxable: number | string;
  totalNonTaxable: number | string;
  totalLegalDeductions: number | string;
  totalOtherDeductions: number | string;
  netPayable: number | string;
  afpHistoricalName?: string | null;
  afpHistoricalRate?: number | string | null;
  healthHistoricalName?: string | null;
  details?: any[];
  worker?: {
    name: string;
    paternalLastName?: string | null;
    maternalLastName?: string | null;
    rut: string;
    entryDate?: string | null;
    bankAccountType?: string | null;
    bankAccountNumber?: string | null;
    bank?: { name: string } | null;
    company?: {
      name: string;
      rutCompany: string;
      address?: string | null;
    } | null;
    afp?: { name: string; commissionRate: number | string } | null;
    healthInstitution?: { name: string; isIsapre: boolean } | null;
    contractType?: { name: string } | null;
    jobPosition?: { name: string } | null;
  };
}

/**
 * 1. Exports a CSV payment matrix compatible with Excel (BOM UTF-8)
 */
export function exportPaymentCsv(payrolls: PayrollExportData[], companyName = 'Todas_Las_Empresas') {
  if (!payrolls || payrolls.length === 0) return;

  const period = payrolls[0]?.periodYyyyMm || 'Periodo';
  const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');

  const headers = [
    'RUT Trabajador',
    'Nombre Trabajador',
    'Empresa',
    'Período',
    'Sueldo Base ($)',
    'Total Imponible ($)',
    'Desc. Legales ($)',
    'Líquido a Pagar ($)',
    'Banco Destino',
    'Tipo de Cuenta',
    'Número de Cuenta',
  ];

  const rows = payrolls.map((p) => {
    const workerName = [p.worker?.name, p.worker?.paternalLastName, p.worker?.maternalLastName]
      .filter(Boolean)
      .join(' ');

    return [
      `"${p.worker?.rut || ''}"`,
      `"${workerName}"`,
      `"${p.worker?.company?.name || 'Sin Empresa'}"`,
      `"${p.periodYyyyMm}"`,
      Number(p.baseSalaryAgreed),
      Number(p.totalTaxable),
      Number(p.totalLegalDeductions),
      Number(p.netPayable),
      `"${p.worker?.bank?.name || 'No informado'}"`,
      `"${p.worker?.bankAccountType || 'No informado'}"`,
      `"${p.worker?.bankAccountNumber || 'No informado'}"`,
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `Nomina_Pago_${cleanCompanyName}_${period}.csv`);
}

/**
 * Helper to render HTML element for a single liquidacion
 */
export function createLiquidacionHtmlElement(p: PayrollExportData): HTMLElement {
  const worker = p.worker;
  const company = worker?.company;
  const workerFullName = [worker?.name, worker?.paternalLastName, worker?.maternalLastName]
    .filter(Boolean)
    .join(' ');

  const taxableItems = p.details?.filter((d) => d.conceptType === 'TAXABLE_INCOME') || [];
  const nonTaxableItems = p.details?.filter((d) => d.conceptType === 'NON_TAXABLE_INCOME') || [];
  const legalDeductions = p.details?.filter((d) => d.conceptType === 'LEGAL_DEDUCTION') || [];
  const otherDeductions = p.details?.filter((d) => d.conceptType === 'OTHER_DEDUCTION') || [];

  const netPayableNumber = Number(p.netPayable);
  const netPayableInWords = numberToWordsCLP(netPayableNumber);

  const div = document.createElement('div');
  div.style.backgroundColor = '#ffffff';
  div.style.color = '#37352F';
  div.style.padding = '32px';
  div.style.fontFamily = 'sans-serif';
  div.style.fontSize = '12px';
  div.style.boxSizing = 'border-box';
  div.style.width = '750px';

  div.innerHTML = `
    <div style="border-bottom: 2px solid #37352F; padding-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
      <div>
        <h2 style="color: #37352F; font-weight: 800; font-size: 16px; text-transform: uppercase; margin: 0;">
          ${company?.name || 'EMPRESA NO ASIGNADA'}
        </h2>
        <p style="color: #787774; font-size: 11px; margin: 2px 0 0 0;">RUT Empresa: <strong>${company?.rutCompany || 'N/A'}</strong></p>
        <p style="color: #787774; font-size: 11px; margin: 2px 0 0 0;">Dirección: ${company?.address || 'Chile'}</p>
      </div>
      <div style="text-align: right;">
        <h1 style="color: #37352F; font-size: 18px; font-weight: 900; text-transform: uppercase; margin: 0;">
          Liquidación de Sueldo
        </h1>
        <span style="background-color: #f5f5f5; color: #37352F; border: 1px solid #d4d4d4; display: inline-block; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-family: monospace; font-size: 12px; margin-top: 4px;">
          PERÍODO: ${p.periodYyyyMm}
        </span>
      </div>
    </div>

    <div style="background-color: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 12px; padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
      <div style="line-height: 1.6;">
        <p style="margin: 0;"><strong>Nombre Trabajador:</strong> <span style="text-transform: uppercase;">${workerFullName || 'N/A'}</span></p>
        <p style="margin: 0;"><strong>RUT Trabajador:</strong> <span style="font-family: monospace;">${worker?.rut || 'N/A'}</span></p>
        <p style="margin: 0;"><strong>Cargo / Función:</strong> ${worker?.jobPosition?.name || 'Dependiente'}</p>
        <p style="margin: 0;"><strong>Tipo de Contrato:</strong> ${worker?.contractType?.name || 'Indefinido'}</p>
      </div>
      <div style="line-height: 1.6;">
        <p style="margin: 0;"><strong>Fecha de Ingreso:</strong> ${worker?.entryDate ? new Date(worker.entryDate).toLocaleDateString('es-CL') : 'N/A'}</p>
        <p style="margin: 0;"><strong>Días Trabajados:</strong> 30 días</p>
        <p style="margin: 0;"><strong>AFP Afiliada:</strong> ${p.afpHistoricalName || worker?.afp?.name || 'N/A'} (${p.afpHistoricalRate || worker?.afp?.commissionRate || 10}%)</p>
        <p style="margin: 0;"><strong>Salud:</strong> ${p.healthHistoricalName || worker?.healthInstitution?.name || 'Fonasa'}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
      <div style="border: 1px solid #d4d4d4; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="background-color: #262626; color: #ffffff; font-weight: 700; font-size: 11px; text-transform: uppercase; padding: 8px 12px;">
          I. Haberes (Ingresos)
        </div>
        <div style="padding: 12px; line-height: 1.6;">
          <p style="color: #737373; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0;">A. Haberes Imponibles</p>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Sueldo Base Pactado</span>
            <span style="font-family: monospace;">$${Number(p.baseSalaryAgreed).toLocaleString('es-CL')}</span>
          </div>
          ${taxableItems.map((item) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>${item.conceptLabel}</span>
              <span style="font-family: monospace;">$${Number(item.amount).toLocaleString('es-CL')}</span>
            </div>
          `).join('')}
          <div style="border-top: 1px solid #e5e5e5; color: #171717; font-weight: 700; display: flex; justify-content: space-between; padding-top: 4px; margin-top: 4px;">
            <span>Total Imponible</span>
            <span style="font-family: monospace;">$${Number(p.totalTaxable).toLocaleString('es-CL')}</span>
          </div>

          <p style="color: #737373; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 12px 0 8px 0;">B. Haberes No Imponibles</p>
          ${nonTaxableItems.length === 0 ? `<p style="color: #a3a3a3; font-style: italic; font-size: 11px; margin: 0;">Sin haberes no imponibles</p>` : nonTaxableItems.map((item) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>${item.conceptLabel}</span>
              <span style="font-family: monospace;">$${Number(item.amount).toLocaleString('es-CL')}</span>
            </div>
          `).join('')}
          <div style="border-top: 1px solid #e5e5e5; color: #171717; font-weight: 700; display: flex; justify-content: space-between; padding-top: 4px; margin-top: 4px;">
            <span>Total No Imponible</span>
            <span style="font-family: monospace;">$${Number(p.totalNonTaxable).toLocaleString('es-CL')}</span>
          </div>
        </div>
        <div style="background-color: #f5f5f5; border-top: 1px solid #d4d4d4; padding: 12px; font-weight: 700; display: flex; justify-content: space-between;">
          <span>TOTAL HABERES</span>
          <span style="font-family: monospace; font-size: 13px;">$${(Number(p.totalTaxable) + Number(p.totalNonTaxable)).toLocaleString('es-CL')}</span>
        </div>
      </div>

      <div style="border: 1px solid #d4d4d4; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="background-color: #262626; color: #ffffff; font-weight: 700; font-size: 11px; text-transform: uppercase; padding: 8px 12px;">
          II. Descuentos
        </div>
        <div style="padding: 12px; line-height: 1.6;">
          <p style="color: #737373; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 0 0 8px 0;">A. Descuentos Previsionales y Tributarios</p>
          ${legalDeductions.map((item) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>${item.conceptLabel}</span>
              <span style="font-family: monospace;">$${Number(item.amount).toLocaleString('es-CL')}</span>
            </div>
          `).join('')}
          <div style="border-top: 1px solid #e5e5e5; color: #171717; font-weight: 700; display: flex; justify-content: space-between; padding-top: 4px; margin-top: 4px;">
            <span>Total Descuentos Legales</span>
            <span style="font-family: monospace;">$${Number(p.totalLegalDeductions).toLocaleString('es-CL')}</span>
          </div>

          <p style="color: #737373; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; margin: 12px 0 8px 0;">B. Otros Descuentos</p>
          ${otherDeductions.length === 0 ? `<p style="color: #a3a3a3; font-style: italic; font-size: 11px; margin: 0;">Sin otros descuentos</p>` : otherDeductions.map((item) => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>${item.conceptLabel}</span>
              <span style="font-family: monospace;">$${Number(item.amount).toLocaleString('es-CL')}</span>
            </div>
          `).join('')}
          <div style="border-top: 1px solid #e5e5e5; color: #171717; font-weight: 700; display: flex; justify-content: space-between; padding-top: 4px; margin-top: 4px;">
            <span>Total Otros Descuentos</span>
            <span style="font-family: monospace;">$${Number(p.totalOtherDeductions).toLocaleString('es-CL')}</span>
          </div>
        </div>
        <div style="background-color: #f5f5f5; border-top: 1px solid #d4d4d4; padding: 12px; font-weight: 700; display: flex; justify-content: space-between;">
          <span>TOTAL DESCUENTOS</span>
          <span style="font-family: monospace; font-size: 13px;">$${(Number(p.totalLegalDeductions) + Number(p.totalOtherDeductions)).toLocaleString('es-CL')}</span>
        </div>
      </div>
    </div>

    <div style="background-color: #37352F; color: #ffffff; padding: 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
      <div>
        <span style="color: #a3a3a3; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block; letter-spacing: 0.05em;">
          ALCANCE LÍQUIDO A RECIBIR
        </span>
        <span style="color: #e5e5e5; font-size: 12px; font-style: italic; font-weight: 500;">
          Son: ${netPayableInWords}
        </span>
      </div>
      <span style="color: #ffffff; font-size: 24px; font-weight: 900; font-family: monospace;">
        $${netPayableNumber.toLocaleString('es-CL')} CLP
      </span>
    </div>

    <div style="color: #525252; margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; text-align: center;">
      <div>
        <div style="border-top: 1px solid #a3a3a3; margin: 0 16px 8px 16px;"></div>
        <p style="color: #37352F; font-weight: 700; margin: 0;">Firma Trabajador</p>
        <p style="color: #a3a3a3; font-size: 10px; margin: 2px 0 0 0;">Recibí Conforme</p>
      </div>
      <div>
        <div style="border-top: 1px solid #a3a3a3; margin: 0 16px 8px 16px;"></div>
        <p style="color: #37352F; font-weight: 700; margin: 0;">Firma Empleador</p>
        <p style="color: #a3a3a3; font-size: 10px; margin: 2px 0 0 0;">${company?.name || 'Representante Legal'}</p>
      </div>
    </div>
  `;

  return div;
}

/**
 * 2. Exports a single unified multi-page PDF containing all filtered liquidations
 */
export async function generateUnifiedPdf(payrolls: PayrollExportData[], companyName = 'Todas_Las_Empresas') {
  if (!payrolls || payrolls.length === 0) return;

  const period = payrolls[0]?.periodYyyyMm || 'Periodo';
  const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0px';
  container.style.top = '0px';
  container.style.zIndex = '-9999';
  container.style.opacity = '1';
  container.style.pointerEvents = 'none';
  container.style.width = '750px';
  container.style.backgroundColor = '#ffffff';

  payrolls.forEach((p, idx) => {
    const itemEl = createLiquidacionHtmlElement(p);
    if (idx < payrolls.length - 1) {
      itemEl.style.pageBreakAfter = 'always';
    }
    container.appendChild(itemEl);
  });

  document.body.appendChild(container);

  const opt = {
    margin: [8, 8, 8, 8] as [number, number, number, number],
    filename: `Liquidaciones_Unificadas_${cleanCompanyName}_${period}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 750,
      onclone: (clonedDoc: Document) => {
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((tag) => {
          if (tag.innerHTML.includes('oklch')) {
            tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]+\)/g, '#37352f');
          }
        });
      },
    },
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' as const },
    pagebreak: { mode: ['css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * 3. Generates a ZIP archive containing individual PDFs for each worker
 */
export async function generateZipOfPdfs(
  payrolls: PayrollExportData[],
  companyName = 'Todas_Las_Empresas',
  onProgress?: (count: number, total: number) => void
) {
  if (!payrolls || payrolls.length === 0) return;

  const period = payrolls[0]?.periodYyyyMm || 'Periodo';
  const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const zip = new JSZip();

  for (let i = 0; i < payrolls.length; i++) {
    const p = payrolls[i];
    if (onProgress) onProgress(i + 1, payrolls.length);

    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '0px';
    tempDiv.style.top = '0px';
    tempDiv.style.zIndex = '-9999';
    tempDiv.style.opacity = '1';
    tempDiv.style.pointerEvents = 'none';
    tempDiv.style.width = '750px';
    tempDiv.style.backgroundColor = '#ffffff';

    const itemEl = createLiquidacionHtmlElement(p);
    tempDiv.appendChild(itemEl);
    document.body.appendChild(tempDiv);

    const opt = {
      margin: [8, 8, 8, 8] as [number, number, number, number],
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 750,
        onclone: (clonedDoc: Document) => {
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((tag) => {
            if (tag.innerHTML.includes('oklch')) {
              tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]+\)/g, '#37352f');
            }
          });
        },
      },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' as const },
    };

    try {
      const pdfBlob = await html2pdf().set(opt).from(tempDiv).output('blob');
      const safeRut = (p.worker?.rut || `Worker_${i + 1}`).replace(/[^a-zA-Z0-9_-]/g, '');
      zip.file(`Liquidacion_${safeRut}_${period}.pdf`, pdfBlob);
    } finally {
      document.body.removeChild(tempDiv);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `Liquidaciones_${cleanCompanyName}_${period}.zip`);
}
