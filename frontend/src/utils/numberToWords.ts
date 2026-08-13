/**
 * Converts a positive integer number into official Spanish words (Chilean CLP format)
 */
export function numberToWordsCLP(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return 'ZERO PESOS';
  const integer = Math.floor(Math.abs(num));
  if (integer === 0) return 'CERO PESOS';

  const units = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const teens = [
    'DIEZ',
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISÉIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE',
  ];
  const tens = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const hundreds = [
    '',
    'CIENTO',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS',
  ];

  function convertGroup(n: number): string {
    let output = '';

    if (n === 100) return 'CIEN';

    if (n >= 100) {
      output += hundreds[Math.floor(n / 100)] + ' ';
      n %= 100;
    }

    if (n >= 10 && n <= 19) {
      output += teens[n - 10] + ' ';
      return output.trim();
    }

    if (n >= 21 && n <= 29) {
      output += 'VEINTI' + units[n - 20] + ' ';
      return output.trim();
    }

    if (n >= 20) {
      output += tens[Math.floor(n / 10)];
      if (n % 10 > 0) {
        output += ' Y ' + units[n % 10];
      }
      output += ' ';
      return output.trim();
    }

    if (n > 0) {
      output += units[n] + ' ';
    }

    return output.trim();
  }

  let words = '';

  // Millions (1,000,000)
  if (integer >= 1000000) {
    const millions = Math.floor(integer / 1000000);
    if (millions === 1) {
      words += 'UN MILLÓN ';
    } else {
      words += convertGroup(millions) + ' MILLONES ';
    }
    const remainder = integer % 1000000;
    if (remainder > 0) {
      words += convertGroup(Math.floor(remainder / 1000)) ? '' : '';
    }
  }

  // Thousands (1,000)
  const thousands = Math.floor((integer % 1000000) / 1000);
  if (thousands > 0) {
    if (thousands === 1) {
      words += 'MIL ';
    } else {
      words += convertGroup(thousands) + ' MIL ';
    }
  }

  // Hundreds & units
  const rest = integer % 1000;
  if (rest > 0) {
    words += convertGroup(rest) + ' ';
  }

  return `${words.trim()} PESOS`.toUpperCase();
}

export default numberToWordsCLP;
