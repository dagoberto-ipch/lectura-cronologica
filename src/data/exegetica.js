// La nota exegética se redacta a partir del tema de cada capítulo leído ese día.
// El índice de 1189 capítulos vive en ./temas; aquí solo se arma el texto y
// se añade la bibliografía Reformada Presbiteriana según los libros del día.

import { LIBROS } from './biblia.js'
import { TEMAS } from './temas/index.js'
import { agruparLecturas, formatearReferencias } from '../lib/referencias.js'

const FAMILIAS = [
  {
    ids: ['genesis', 'exodo', 'levitico', 'numeros', 'deuteronomio'],
    testamento: 'AT',
  },
  {
    ids: [
      'josue', 'jueces', 'rut', '1-samuel', '2-samuel', '1-reyes', '2-reyes',
      '1-cronicas', '2-cronicas', 'esdras', 'nehemias', 'ester',
    ],
    testamento: 'AT',
  },
  {
    ids: ['job', 'salmos', 'proverbios', 'eclesiastes', 'cantar'],
    testamento: 'AT',
  },
  {
    ids: [
      'isaias', 'jeremias', 'lamentaciones', 'ezequiel', 'daniel', 'oseas', 'joel',
      'amos', 'abdias', 'jonas', 'miqueas', 'nahum', 'habacuc', 'sofonias', 'hageo',
      'zacarias', 'malaquias',
    ],
    testamento: 'AT',
  },
  { ids: ['mateo', 'marcos', 'lucas', 'juan'], testamento: 'NT' },
  { ids: ['hechos'], testamento: 'NT' },
  {
    ids: [
      'romanos', '1-corintios', '2-corintios', 'galatas', 'efesios', 'filipenses',
      'colosenses', '1-tesalonicenses', '2-tesalonicenses', '1-timoteo', '2-timoteo',
      'tito', 'filemon', 'hebreos', 'santiago', '1-pedro', '2-pedro', '1-juan',
      '2-juan', '3-juan', 'judas',
    ],
    testamento: 'NT',
  },
  { ids: ['apocalipsis'], testamento: 'NT' },
]

const BIBLIOGRAFIA_BASE = [
  'NBLA, Biblia de Estudio Cronológica, Editorial Vida.',
  'Juan Calvino, Institución de la Religión Cristiana.',
  'Confesión de Fe de Westminster (1646) y Catecismo Mayor de Westminster.',
  'Geerhardus Vos, Teología Bíblica.',
  'Herman Bavinck, Dogmática Reformada.',
  'Matthew Henry, Comentario Bíblico.',
]

const BIBLIOGRAFIA_ANTIGUO = ['C. F. Keil y F. Delitzsch, Comentario bíblico del Antiguo Testamento.']
const BIBLIOGRAFIA_NUEVO = [
  'D. A. Carson, comentarios al Nuevo Testamento.',
  'William Hendriksen, Comentario del Nuevo Testamento.',
]

// Los nombres más largos van primero: «1 Juan» no debe confundirse con «Juan».
const NOMBRES_ORDENADOS = [...LIBROS].sort((a, b) => b.nombre.length - a.nombre.length)

function libroPorId(id) {
  return LIBROS.find((libro) => libro.id === id)
}

// Acepta las lecturas estructuradas del plan o una referencia en texto.
function lecturasDesde(entrada) {
  if (Array.isArray(entrada)) {
    return entrada.filter((item) => item && item.libroId && Number.isInteger(item.capitulo))
  }
  if (typeof entrada !== 'string' || !entrada.trim()) return []

  const lecturas = []
  for (const parte of entrada.split(';')) {
    const texto = parte.trim().toLowerCase()
    const libro = NOMBRES_ORDENADOS.find((item) => texto.includes(item.nombre.toLowerCase()))
    if (!libro) continue

    const desdeIndice = texto.indexOf(libro.nombre.toLowerCase()) + libro.nombre.length
    const numeros = texto.slice(desdeIndice).match(/\d+/g)?.map(Number) ?? []
    if (!numeros.length) continue

    const desde = numeros[0]
    const hasta = numeros[1] ?? desde
    for (let capitulo = desde; capitulo <= hasta; capitulo += 1) {
      lecturas.push({
        libroId: libro.id,
        libro: libro.nombre,
        capitulo,
        testamento: libro.testamento,
      })
    }
  }
  return lecturas
}

function familiaDe(libroId) {
  return FAMILIAS.find((familia) => familia.ids.includes(libroId))
}

function frase(texto) {
  const limpio = texto.replace(/[.\s]+$/, '')
  return /[?!]$/.test(limpio) ? limpio : `${limpio}.`
}

function puntosDelCapitulo(libroId, capitulo) {
  const tema = TEMAS[libroId]?.[capitulo - 1]
  if (!tema) return null
  const [observacion, interpretacion, aplicacion] = tema.split(' | ')
  if (!observacion || !interpretacion || !aplicacion) return null
  return {
    observacion: frase(observacion),
    interpretacion: frase(interpretacion),
    aplicacion: frase(aplicacion),
  }
}

export function generarNotaExegetica(entrada = '') {
  const lecturas = lecturasDesde(entrada)
  if (!lecturas.length) return ''

  const referencia = formatearReferencias(lecturas)
  const observaciones = []
  const interpretaciones = []
  const aplicaciones = []
  const grupos = agruparLecturas(lecturas)

  for (const grupo of grupos) {
    for (let capitulo = grupo.desde; capitulo <= grupo.hasta; capitulo += 1) {
      const puntos = puntosDelCapitulo(grupo.libroId, capitulo)
      if (!puntos) continue
      const etiqueta = `${grupo.libro} ${capitulo}`
      observaciones.push(`${etiqueta}: ${puntos.observacion}`)
      interpretaciones.push(`${etiqueta}: ${puntos.interpretacion}`)
      aplicaciones.push(`${etiqueta}: ${puntos.aplicacion}`)
    }
  }

  if (!observaciones.length) return ''

  const fuentes = bibliografiaPara(entrada)
    .map((obra) => obra.replace(/\.$/, ''))
    .join('; ')

  return [
    `1) Observación — ${referencia}. ${observaciones.join(' ')}`,
    `2) Interpretación — ${interpretaciones.join(' ')}`,
    `3) Aplicación cristocéntrica — ${aplicaciones.join(' ')}`,
    `Fuentes Reformadas Presbiterianas — ${fuentes}.`,
  ].join('\n\n')
}

export function bibliografiaPara(entrada = '') {
  const lecturas = lecturasDesde(entrada)
  const testamentos = new Set(
    lecturas.map((lectura) => familiaDe(lectura.libroId)?.testamento ?? libroPorId(lectura.libroId)?.testamento),
  )
  const obras = new Set(BIBLIOGRAFIA_BASE)
  if (testamentos.has('AT')) BIBLIOGRAFIA_ANTIGUO.forEach((obra) => obras.add(obra))
  if (testamentos.has('NT')) BIBLIOGRAFIA_NUEVO.forEach((obra) => obras.add(obra))
  return [...obras]
}
