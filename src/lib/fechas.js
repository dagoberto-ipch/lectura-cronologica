export function fechaDelDia(fechaInicio, dia) {
  const fecha = new Date(`${fechaInicio}T00:00:00`)
  if (Number.isNaN(fecha.getTime())) return new Date()
  fecha.setDate(fecha.getDate() + dia - 1)
  return fecha
}

export function aISO(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

export function hoyISO() {
  return aISO(new Date())
}

export function inicioDelAnio(anio = new Date().getFullYear()) {
  return `${String(anio).padStart(4, '0')}-01-01`
}

export function esAnioBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0
}

export function diasDelAnio(anio) {
  return esAnioBisiesto(anio) ? 366 : 365
}

export function sumarDias(fechaInicio, dias) {
  const fecha = new Date(`${fechaInicio}T00:00:00`)
  fecha.setDate(fecha.getDate() + dias)
  return fecha
}

export function diaDeHoy(fechaInicio, totalDias) {
  const inicio = new Date(`${fechaInicio}T00:00:00`)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const diferencia = Math.round((hoy - inicio) / 86400000) + 1
  return Math.min(Math.max(diferencia, 1), totalDias)
}

const corta = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })
const larga = new Intl.DateTimeFormat('es', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function formatearCorta(fecha) {
  return corta.format(fecha)
}

/** Fecha visible sin año: «1 de enero», «31 de diciembre». */
export function formatearSinAnio(fecha) {
  return `${fecha.getDate()} de ${MESES[fecha.getMonth()]}`
}

export function formatearLarga(fecha) {
  return larga.format(fecha)
}
