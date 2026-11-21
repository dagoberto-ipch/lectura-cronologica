// Plantilla editable para cada día. Todos los campos son opcionales y se
// rellenan en el navegador; se puede ampliar sin migrar el localStorage.

import { formatearReferencias } from '../lib/referencias.js'
import { generarNotaExegetica } from './exegetica.js'

// Cambia cuando se reescriba el contenido generado: permite regenerar solo
// las notas antiguas de la app sin borrar lo que el estudiante haya editado.
export const VERSION_NOTA = 4

function prepararEntrada(entrada) {
  if (Array.isArray(entrada)) {
    return { lecturas: entrada, referencia: formatearReferencias(entrada) }
  }
  const texto = typeof entrada === 'string' ? entrada : ''
  return { lecturas: [], referencia: texto }
}

function sugerirPreguntas(referencia = '') {
  const ref = referencia.trim() || 'este texto'
  return {
    estudio: [
      `¿Cuál es el tema central de ${ref} y qué revela sobre el carácter de Dios?`,
      `¿Qué evento, mandato o promesa de ${ref} destaca lo más importante de esta sección?`,
      `¿Cómo se cumple o se refleja en Cristo lo que ${ref} enseña?`,
    ],
    aplicacion: [
      `¿Qué cambio concreto te pide ${ref} en tu relación con Dios y con tu comunidad de fe?`,
      `¿Cómo puedes vivir hoy, por el Espíritu Santo, lo que ${ref} enseña en comunión con Jesucristo?`,
    ],
  }
}

function normalizarPregunta(valor, sugerencia = '') {
  if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
    return {
      texto: typeof valor.texto === 'string' ? valor.texto : '',
      respuesta: typeof valor.respuesta === 'string' ? valor.respuesta : '',
    }
  }
  return { texto: typeof valor === 'string' ? valor : sugerencia, respuesta: '' }
}

export function crearExtras(entrada = '') {
  const { lecturas, referencia } = prepararEntrada(entrada)
  const notaGenerada = generarNotaExegetica(lecturas.length ? lecturas : referencia)
  const sugerencias = sugerirPreguntas(referencia)
  return {
    titulo: '',
    versiculoClave: '',
    notaExegetica: notaGenerada,
    notaExegeticaVersion: notaGenerada ? VERSION_NOTA : 0,
    notaEditada: false,
    preguntasEstudio: sugerencias.estudio.map((texto) => ({ texto, respuesta: '' })),
    preguntasAplicacion: sugerencias.aplicacion.map((texto) => ({ texto, respuesta: '' })),
    notas: '',
    recursos: [],
    personalizado: {},
  }
}

export function normalizarExtras(valor, entrada = '') {
  const base = crearExtras(entrada)
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return base

  const { referencia } = prepararEntrada(entrada)
  const sugerencias = sugerirPreguntas(referencia)

  const preguntasEstudio = Array.isArray(valor.preguntasEstudio)
    ? valor.preguntasEstudio.map((item, indice) =>
        normalizarPregunta(item, sugerencias.estudio[indice] ?? ''),
      )
    : Array.isArray(valor.preguntas)
      ? valor.preguntas.map((item, indice) =>
          normalizarPregunta(item, sugerencias.estudio[indice] ?? ''),
        )
      : base.preguntasEstudio

  const preguntasAplicacion = Array.isArray(valor.preguntasAplicacion)
    ? valor.preguntasAplicacion.map((item, indice) =>
        normalizarPregunta(item, sugerencias.aplicacion[indice] ?? ''),
      )
    : base.preguntasAplicacion

  const notaGuardada = typeof valor.notaExegetica === 'string' ? valor.notaExegetica : ''
  const notaEditada = valor.notaEditada === true
  const notaGenericaAntigua =
    !notaEditada &&
    valor.notaExegeticaVersion !== VERSION_NOTA &&
    /^1\) Observación/.test(notaGuardada)
  const usarNotaGenerada =
    Boolean(base.notaExegetica) && (!notaGuardada.trim() || notaGenericaAntigua)

  return {
    titulo: typeof valor.titulo === 'string' ? valor.titulo : base.titulo,
    versiculoClave:
      typeof valor.versiculoClave === 'string' ? valor.versiculoClave : base.versiculoClave,
    notaExegetica: usarNotaGenerada ? base.notaExegetica : notaGuardada,
    notaEditada: usarNotaGenerada ? false : notaEditada,
    notaExegeticaVersion: usarNotaGenerada
      ? VERSION_NOTA
      : typeof valor.notaExegeticaVersion === 'number'
        ? valor.notaExegeticaVersion
        : 0,
    preguntasEstudio,
    preguntasAplicacion,
    notas: typeof valor.notas === 'string' ? valor.notas : base.notas,
    recursos: Array.isArray(valor.recursos)
      ? valor.recursos
          .filter((item) => item && typeof item === 'object')
          .map((item) => ({
            etiqueta: typeof item.etiqueta === 'string' ? item.etiqueta : '',
            url: typeof item.url === 'string' ? item.url : '',
          }))
      : base.recursos,
    personalizado:
      valor.personalizado && typeof valor.personalizado === 'object' && !Array.isArray(valor.personalizado)
        ? valor.personalizado
        : base.personalizado,
  }
}
