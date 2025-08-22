/**
 * Formata uma data para o formato esperado pelo backend: dd/MM/yyyy HH:mm:ss ou dd/MM/yyyy HH:mm
 * @param date - Data a ser formatada (Date, string ISO, ou string)
 * @param includeSeconds - Se deve incluir os segundos (padrão: true)
 * @returns String formatada no padrão dd/MM/yyyy HH:mm:ss ou dd/MM/yyyy HH:mm
 */
export function formatDateForBackend(date: Date | string, includeSeconds: boolean = true): string {
  if (!date) return ''
  
  const d = new Date(date)
  
  // Verificar se a data é válida
  if (isNaN(d.getTime())) {
    throw new Error('Data inválida fornecida para formatação')
  }
  
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  const dateStr = `${day}/${month}/${year}`
  const timeStr = includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
  
  return `${dateStr} ${timeStr}`
}

/**
 * Converte uma data do formato backend (dd/MM/yyyy HH:mm:ss ou dd/MM/yyyy HH:mm) para Date
 * @param dateStr - String da data no formato backend
 * @returns Objeto Date
 */
export function parseDateFromBackend(dateStr: string): Date {
  if (!dateStr) throw new Error('String de data vazia')
  
  // Regex para capturar dd/MM/yyyy HH:mm:ss ou dd/MM/yyyy HH:mm
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/
  const match = dateStr.match(regex)
  
  if (!match) {
    throw new Error(`Formato de data inválido: ${dateStr}. Esperado: dd/MM/yyyy HH:mm:ss ou dd/MM/yyyy HH:mm`)
  }
  
  const [, day, month, year, hours, minutes, seconds = '0'] = match
  
  return new Date(
    parseInt(year),
    parseInt(month) - 1, // Mês é 0-indexado
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  )
}

/**
 * Formata uma data para exibição no formato brasileiro
 * @param date - Data a ser formatada
 * @param includeTime - Se deve incluir a hora (padrão: true)
 * @returns String formatada para exibição
 */
export function formatDateForDisplay(date: Date | string, includeTime: boolean = true): string {
  if (!date) return '—'
  
  const d = new Date(date)
  
  if (isNaN(d.getTime())) return '—'
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
  
  return d.toLocaleString('pt-BR', options)
}
