const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "March 2025" — EN cards and teasers. Uses UTC to avoid TZ off-by-one. */
export function monthYearEN(date: Date): string {
  return `${MONTHS_EN[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "March 15, 2025" — EN article page. */
export function fullDateEN(date: Date): string {
  return `${MONTHS_EN[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** "Março 2025" — used on cards and teasers. Uses UTC to avoid TZ off-by-one. */
export function monthYear(date: Date): string {
  return `${MONTHS_PT[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "15 de março de 2025" — used on the article page. */
export function fullDate(date: Date): string {
  return `${date.getUTCDate()} de ${MONTHS_PT[date.getUTCMonth()].toLowerCase()} de ${date.getUTCFullYear()}`;
}
