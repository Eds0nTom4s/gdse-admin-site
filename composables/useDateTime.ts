import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/pt'

dayjs.extend(customParseFormat)
dayjs.locale('pt')

export function useDateTimeField() {
  const dateTimeText = ref<string>('')
  const dateTimeLocal = ref<string>('')
  const dateTimeError = ref<string>('')
  const dataHoraInput = ref<HTMLInputElement | null>(null)

  // Converter de formato local (YYYY-MM-DDTHH:mm) para DD/MM/YYYY HH:mm:ss
  function localToFormatted(localValue: string): string {
    if (!localValue) return ''
    try {
      const date = new Date(localValue)
      if (isNaN(date.getTime())) return ''
      
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      
      return `${day}/${month}/${year} ${hours}:${minutes}:00`
    } catch {
      return ''
    }
  }

  // Converter de DD/MM/YYYY HH:mm:ss para formato local (YYYY-MM-DDTHH:mm)
  function formattedToLocal(formattedValue: string): string {
    if (!formattedValue) return ''
    try {
      const parsed = dayjs(formattedValue, 'DD/MM/YYYY HH:mm:ss', true)
      if (!parsed.isValid()) return ''
      return parsed.format('YYYY-MM-DDTHH:mm')
    } catch {
      return ''
    }
  }

  function isValidDateTimeText(value: string) {
    return dayjs(value, 'DD/MM/YYYY HH:mm:ss', true).isValid()
  }

  function validateDateTime() {
    dateTimeError.value = ''
    if (!dateTimeText.value) return
    
    const parsed = dayjs(dateTimeText.value, 'DD/MM/YYYY HH:mm:ss', true)
    if (!parsed.isValid()) {
      dateTimeError.value = 'Data/hora inválida'
      return
    }
    
    // Validar se não é no passado
    if (parsed.isBefore(dayjs())) {
      dateTimeError.value = 'Não é permitido agendar jogo no passado'
      return
    }
  }

  function onDateTimePickerChange() {
    dateTimeText.value = localToFormatted(dateTimeLocal.value)
    validateDateTime()
  }

  function onDateTimeBlur() {
    validateDateTime()
  }

  // Sincronizar quando dateTimeText for alterado externamente
  function syncToLocal(value: string) {
    dateTimeLocal.value = formattedToLocal(value)
    dateTimeText.value = value
  }

  return {
    dateTimeText,
    dateTimeLocal,
    dateTimeError,
    dataHoraInput,
    onDateTimePickerChange,
    onDateTimeBlur,
    validateDateTime,
    isValidDateTimeText,
    syncToLocal
  }
}

export function formatDateTimeDisplay(value?: string) {
  if (!value) return '—'
  const d = dayjs(value, 'DD/MM/YYYY HH:mm:ss', true)
  const base = d.isValid() ? d : dayjs(value)
  return base.isValid() ? base.format('DD/MM/YYYY HH:mm:ss') : '—'
}

export function getTimeMillis(value?: string) {
  if (!value) return 0
  const d1 = dayjs(value, 'DD/MM/YYYY HH:mm:ss', true)
  if (d1.isValid()) return d1.valueOf()
  const d2 = dayjs(value)
  return d2.isValid() ? d2.valueOf() : 0
}


