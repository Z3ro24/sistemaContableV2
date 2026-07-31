# Proposal: Payroll PDF Printable Modal & Download

## Why
Employers and accounting staff need a legally compliant Chilean "Liquidación de Sueldo" document that can be previewed, printed, and downloaded as a PDF file directly from the application for employee record-keeping and signature compliance under Dirección del Trabajo (DT Chile) guidelines.

## What Changes
- Add a new `PayrollPdfModal` component in `frontend/src/components/modals/PayrollPdfModal.tsx`.
- Render an official Chilean Liquidación de Sueldo document containing:
  - Header: Company Name, RUT, Address, Issue Date, Period YYYY-MM.
  - Worker Info: Full Name, RUT, Entry Date, Job Title, Days Worked, AFP & Health Institution details.
  - Tabular breakdown: Imponible Income, Non-Imponible Income, Legal Deductions (AFP, Health, AFC, Unique Tax), Other Deductions.
  - Net Payable Amount in numbers & written Spanish words (e.g. *"Cuatrocientos ochenta y seis mil setecientos ochenta pesos"*).
  - Formal signature lines: *"Firma Trabajador (Recibí Conforme)"* & *"Firma Empleador"*.
- Actions: **"Descargar PDF"** (using `html2pdf.js` / browser print stream) and **"Imprimir"**.
- Wire an **"Acciones / Ver Liquidación (PDF)"** button into `PayrollsPage.tsx` table for each generated payroll record.
