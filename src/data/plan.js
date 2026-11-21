import { diasDelAnio } from '../lib/fechas.js'
import { LIBROS_CRONOLOGICOS, TOTAL_CAPITULOS } from './biblia.js'

export const PLANES = [
  {
    id: '1ano',
    nombre: '1 año',
    descripcion: 'La Biblia completa en un año · 3 o 4 capítulos por día',
  },
  {
    id: '2anos',
    nombre: '2 años',
    descripcion: 'La Biblia completa en dos años · 1 o 2 capítulos por día',
  },
]

function capitulosEnOrdenCronologico() {
  return LIBROS_CRONOLOGICOS.flatMap((libro) =>
    Array.from({ length: libro.capitulos }, (_, indice) => ({
      libroId: libro.id,
      libro: libro.nombre,
      abreviatura: libro.abreviatura,
      capitulo: indice + 1,
      testamento: libro.testamento,
    })),
  )
}

const cache = new Map()

// Reparte los 1189 capítulos entre N días sin omisiones ni repeticiones.
// El reparto por acumulados mantiene los días equilibrados y deterministas.
export function generarPlan(totalDias) {
  if (cache.has(totalDias)) return cache.get(totalDias)

  const capitulos = capitulosEnOrdenCronologico()
  const dias = []
  let desde = 0

  for (let numero = 1; numero <= totalDias; numero += 1) {
    const hasta = Math.floor((TOTAL_CAPITULOS * numero) / totalDias)
    dias.push({
      dia: numero,
      lecturas: capitulos.slice(desde, hasta),
    })
    desde = hasta
  }

  if (desde !== capitulos.length) {
    throw new Error('El reparto del plan no cubre todos los capítulos')
  }

  cache.set(totalDias, dias)
  return dias
}

export const PLAN_1ANO = generarPlan(365)
export const PLAN_2ANOS = generarPlan(730)

// Del 1 de enero al 31 de diciembre: 365/366 días en un año, 730/731 en dos.
export function diasDelPlan(idPlan, fechaInicio) {
  if (!fechaInicio) return idPlan === '2anos' ? 730 : 365

  const anio = Number(fechaInicio.slice(0, 4))
  if (!Number.isInteger(anio)) return idPlan === '2anos' ? 730 : 365

  return idPlan === '2anos'
    ? diasDelAnio(anio) + diasDelAnio(anio + 1)
    : diasDelAnio(anio)
}

export function obtenerPlan(idPlan, fechaInicio) {
  return generarPlan(diasDelPlan(idPlan, fechaInicio))
}

export function obtenerConfigPlan(idPlan) {
  return PLANES.find((plan) => plan.id === idPlan) ?? PLANES[0]
}

export function obtenerDia(idPlan, numero, fechaInicio) {
  const plan = obtenerPlan(idPlan, fechaInicio)
  const indice = Math.min(Math.max(Number(numero) || 1, 1), plan.length) - 1
  return plan[indice]
}
