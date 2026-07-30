/**
 * Cleans a RUT string leaving only digits and 'k'/'K'
 */
export const cleanRut = (rut: string): string => {
  if (!rut) return '';
  return rut.replace(/[^0-9kK]/g, '');
};

/**
 * Formats a raw or partial RUT into standard Chilean format: 11.111.111-1
 */
export const formatRut = (rut: string): string => {
  const cleaned = cleanRut(rut);
  if (!cleaned) return '';

  if (cleaned.length <= 1) return cleaned;

  const dv = cleaned.slice(-1).toUpperCase();
  let body = cleaned.slice(0, -1);

  // Format body with thousand separator dots
  body = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${body}-${dv}`;
};

/**
 * Validates a Chilean RUT using the Modulo 11 check-digit algorithm
 */
export const validateRut = (rut: string): boolean => {
  const cleaned = cleanRut(rut);
  if (!cleaned || cleaned.length < 8 || cleaned.length > 9) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();

  // Ensure body consists only of digits
  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let multiplier = 2;

  // Calculate Modulo 11 sum from right to left
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const expectedDvNum = 11 - remainder;

  let expectedDv = '';
  if (expectedDvNum === 11) {
    expectedDv = '0';
  } else if (expectedDvNum === 10) {
    expectedDv = 'K';
  } else {
    expectedDv = expectedDvNum.toString();
  }

  return dv === expectedDv;
};
