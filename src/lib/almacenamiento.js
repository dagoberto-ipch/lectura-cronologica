import { normalizarExtras } from '../data/extras.js'
import { obtenerPlan } from '../data/plan.js'
import { inicioDelAnio } from './fechas.js'

export const CLAVE_ALMACENAMIENTO = 'lectura-cronologica:v1'
export const VERSION_ESTADO = 4

function esMapa(valor) {
  return Boolean(valor) && typeof valor === 'object' && !Array.isArray(valor)
}

function estadoPorDefecto() {
  return {
    version: VERSION_ESTADO,
    plan: '1ano',
    fechaInicio: inicioDelAnio(),
    traduccion: 'NBLA',
    completados: { '1ano': {}, '2anos': {} },
    extras: { '1ano': {}, '2anos': {} },
  }
}

function normalizarMapaExtras(valor, idPlan, fechaInicio) {
  if (!esMapa(valor)) return {}
  const plan = obtenerPlan(idPlan, fechaInicio)
  return Object.fromEntries(
    Object.entries(valor).map(([dia, extras]) => {
      const lecturas = plan[Number(dia) - 1]?.lecturas ?? []
      const normalizado = normalizarExtras(extras, lecturas)
      // Los campos sin nombre se descartan solo al cargar, no mientras se editan.
      const personalizado = Object.fromEntries(
        Object.entries(normalizado.personalizado).filter(([clave]) => clave.trim() !== ''),
      )
      return [dia, { ...normalizado, personalizado }]
    }),
  )
}

export function cargarEstado() {
  const base = estadoPorDefecto()

  try {
    const raw = window.localStorage.getItem(CLAVE_ALMACENAMIENTO)
    if (!raw) return base

    const datos = JSON.parse(raw)
    if (!esMapa(datos)) return base

    const fechaGuardada =
      typeof datos.fechaInicio === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(datos.fechaInicio)
        ? datos.fechaInicio
        : null
    // Solo la v1 arrancaba el plan el día de hoy. Las versiones posteriores
    // respetan el año elegido por el estudiante.
    const migrarDesdeV1 = !datos.version || datos.version < 2
    const migrar = datos.version !== VERSION_ESTADO

    const planId = datos.plan === '2anos' ? '2anos' : '1ano'
    const fechaInicio = migrarDesdeV1 ? inicioDelAnio() : (fechaGuardada ?? base.fechaInicio)

    const cargado = {
      ...base,
      ...datos,
      version: VERSION_ESTADO,
      plan: planId,
      fechaInicio,
      completados: {
        '1ano': esMapa(datos.completados?.['1ano']) ? datos.completados['1ano'] : {},
        '2anos': esMapa(datos.completados?.['2anos']) ? datos.completados['2anos'] : {},
      },
      extras: {
        '1ano': normalizarMapaExtras(datos.extras?.['1ano'], '1ano', fechaInicio),
        '2anos': normalizarMapaExtras(datos.extras?.['2anos'], '2anos', fechaInicio),
      },
    }

    if (migrar) guardarEstado(cargado)
    return cargado
  } catch {
    return base
  }
}

export function guardarEstado(estado) {
  try {
    window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado))
  } catch {
    // Si el navegador bloquea el almacenamiento, la app sigue funcionando en memoria.
  }
}

export function borrarEstado() {
  try {
    window.localStorage.removeItem(CLAVE_ALMACENAMIENTO)
  } catch {
    // Sin almacenamiento disponible no hay nada que borrar.
  }
}
