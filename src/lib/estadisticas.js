import { LIBROS } from '../data/biblia.js'
import { normalizarExtras } from '../data/extras.js'
import { sumarDias } from './fechas.js'

export function calcularEstadisticas(plan, completados = {}, fechaInicio, extras = {}) {
  const totalDias = plan.length
  const diasValidos = new Set(plan.map((dia) => dia.dia))
  const diasCompletados = Object.entries(completados)
    .filter(([dia, valor]) => Boolean(valor) && diasValidos.has(Number(dia)))
    .map(([dia]) => Number(dia))
    .sort((a, b) => a - b)

  const diasLeidos = diasCompletados.length
  const totalCapitulos = plan.reduce((total, dia) => total + dia.lecturas.length, 0)
  const capitulosLeidos = diasCompletados.reduce(
    (total, dia) => total + plan[dia - 1].lecturas.length,
    0,
  )

  let rachaActual = 0
  let mejorRacha = 0
  for (let dia = 1; dia <= totalDias; dia += 1) {
    if (completados[dia]) {
      rachaActual += 1
      mejorRacha = Math.max(mejorRacha, rachaActual)
    } else {
      rachaActual = 0
    }
  }

  const leidosPorLibro = new Map()
  for (const dia of diasCompletados) {
    for (const lectura of plan[dia - 1].lecturas) {
      if (!leidosPorLibro.has(lectura.libroId)) leidosPorLibro.set(lectura.libroId, new Set())
      leidosPorLibro.get(lectura.libroId).add(lectura.capitulo)
    }
  }

  const libros = LIBROS.map((libro) => {
    const leidos = leidosPorLibro.get(libro.id)?.size ?? 0
    return {
      ...libro,
      leidos,
      capitulosLeidos: leidos,
      porcentaje: Math.round((leidos / libro.capitulos) * 100),
    }
  })

  const testamentos = ['AT', 'NT'].map((id) => {
    const delTestamento = libros.filter((libro) => libro.testamento === id)
    const leidos = delTestamento.reduce((total, libro) => total + libro.capitulosLeidos, 0)
    const capitulos = delTestamento.reduce((total, libro) => total + libro.capitulos, 0)
    return {
      id,
      nombre: id === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento',
      leidos,
      capitulos,
      porcentaje: capitulos ? Math.round((leidos / capitulos) * 100) : 0,
    }
  })

  const preguntasRegistradas = Object.values(extras).reduce((total, valor) => {
    const dia = normalizarExtras(valor)
    const preguntas = [...dia.preguntasEstudio, ...dia.preguntasAplicacion]
    return total + preguntas.filter((pregunta) => pregunta.respuesta.trim() !== '').length
  }, 0)

  const porcentajeDias = totalDias ? Math.round((diasLeidos / totalDias) * 100) : 0
  const porcentajeCapitulos = totalCapitulos
    ? Math.round((capitulosLeidos / totalCapitulos) * 100)
    : 0

  return {
    diasLeidos,
    diasTotales: totalDias,
    diasRestantes: totalDias - diasLeidos,
    capitulosLeidos,
    totalCapitulos,
    porcentajeDias: diasLeidos > 0 ? Math.max(1, porcentajeDias) : 0,
    porcentajeCapitulos: capitulosLeidos > 0 ? Math.max(1, porcentajeCapitulos) : 0,
    mejorRacha,
    preguntasRegistradas,
    libros,
    librosCompletos: libros.filter((libro) => libro.porcentaje === 100).length,
    testamentos,
    fechaFin: sumarDias(fechaInicio, totalDias - 1),
  }
}
