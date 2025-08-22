import { ref, watch, type Ref, nextTick } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function useJogoConflicts(
  listJogosPorGrupo: (grupoId: number | string) => Promise<any[]>,
  grupoId: Ref<number | undefined>,
  dateTimeText: Ref<string>,
  isValidDateTimeText: (v: string) => boolean,
  autoWatch = true
) {
  const strongConflict = ref(false)
  const dayWarning = ref(false)
  const conflictMessage = ref('')
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  async function precheckConflicts() {
    try {
      strongConflict.value = false
      dayWarning.value = false
      conflictMessage.value = ''
      
      const gid = grupoId.value
      const dt = dateTimeText.value
      
      if (!gid || !dt || !isValidDateTimeText(dt)) return
      
      const lista = await listJogosPorGrupo(gid)
      const target = dayjs(dt, 'DD/MM/YYYY HH:mm:ss', true)
      
      if (!target.isValid()) return
      
      for (const j of (lista || [])) {
        const other = j.dataHora
        let otherMoment = dayjs(other, 'DD/MM/YYYY HH:mm:ss', true)
        if (!otherMoment.isValid()) otherMoment = dayjs(other)
        if (!otherMoment.isValid()) continue
        
        if (otherMoment.isSame(target)) {
          strongConflict.value = true
          conflictMessage.value = 'Já existe um jogo agendado para este grupo nesta data e hora.'
          break
        }
        if (otherMoment.isSame(target, 'day')) {
          dayWarning.value = true
        }
      }
    } catch (e) {
      // silently ignore pre-check errors
      console.debug('Conflict check failed:', e)
    }
  }

  function debouncedPrecheckConflicts() {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(precheckConflicts, 500) // Aumentar debounce
  }

  if (autoWatch) {
    watch(
      () => [grupoId.value, dateTimeText.value],
      debouncedPrecheckConflicts,
      { flush: 'post' }
    )
  }

  return { strongConflict, dayWarning, conflictMessage, precheckConflicts }
}


