import assert from 'node:assert/strict'
import {
  LIBROS,
  LIBROS_CRONOLOGICOS,
  ORDEN_CRONOLOGICO,
  TOTAL_CAPITULOS,
} from '../src/data/biblia.js'
import { crearExtras, normalizarExtras, VERSION_NOTA } from '../src/data/extras.js'
import { bibliografiaPara, generarNotaExegetica } from '../src/data/exegetica.js'
import { TEMAS } from '../src/data/temas/index.js'
import { diasDelAnio, fechaDelDia, formatearSinAnio, aISO } from '../src/lib/fechas.js'
import { generarPlan, obtenerPlan } from '../src/data/plan.js'

assert.equal(LIBROS.length, 66, 'deben ser 66 libros')
assert.equal(TOTAL_CAPITULOS, 1189, 'deben ser 1189 capítulos')
assert.equal(new Set(ORDEN_CRONOLOGICO).size, 66, 'el orden cronológico no debe repetir libros')
assert.equal(LIBROS_CRONOLOGICOS.length, 66)

const esperado = new Set()
for (const libro of LIBROS) {
  for (let capitulo = 1; capitulo <= libro.capitulos; capitulo += 1) {
    esperado.add(`${libro.id}:${capitulo}`)
  }
}

// 365/730 en años normales; 366/731 cuando hay un año bisiesto en el rango.
const largos = [365, 730, diasDelAnio(2028), diasDelAnio(2028) + diasDelAnio(2029)]
for (const totalDias of largos) {
  const plan = generarPlan(totalDias)
  assert.equal(plan.length, totalDias)

  const visto = new Set()
  for (const dia of plan) {
    assert.ok(dia.lecturas.length > 0, `el día ${dia.dia} del plan de ${totalDias} días está vacío`)
    for (const lectura of dia.lecturas) {
      const clave = `${lectura.libroId}:${lectura.capitulo}`
      assert.ok(!visto.has(clave), `capítulo duplicado ${clave} en el plan de ${totalDias} días`)
      visto.add(clave)
    }
  }

  assert.equal(visto.size, 1189, `el plan de ${totalDias} días debe cubrir 1189 capítulos`)
  for (const clave of esperado) {
    assert.ok(visto.has(clave), `falta el capítulo ${clave} en el plan de ${totalDias} días`)
  }

  const minimo = Math.min(...plan.map((dia) => dia.lecturas.length))
  const maximo = Math.max(...plan.map((dia) => dia.lecturas.length))
  console.log(`${totalDias} días: 1189 capítulos, ${minimo}-${maximo} capítulos por día`)
}

// El calendario siempre va del 1 de enero al 31 de diciembre.
for (const anio of [1999, 2000, 2015, 2026, 2028, 2100]) {
  const inicio = `${anio}-01-01`
  for (const [idPlan, anios] of [
    ['1ano', 1],
    ['2anos', 2],
  ]) {
    const plan = obtenerPlan(idPlan, inicio)
    const fin = aISO(fechaDelDia(inicio, plan.length))
    assert.equal(fin, `${anio + anios - 1}-12-31`, `${idPlan} desde ${inicio} debe terminar el 31/12`)
    console.log(`${idPlan} desde ${inicio}: ${plan.length} días → ${fin}`)
  }
}

assert.equal(Object.keys(TEMAS).length, 66, 'el índice debe cubrir los 66 libros')
assert.equal(
  Object.values(TEMAS).reduce((total, capitulos) => total + capitulos.length, 0),
  1189,
  'el índice debe cubrir los 1189 capítulos',
)
for (const libro of LIBROS) {
  TEMAS[libro.id].forEach((entrada, indice) => {
    const referencia = `${libro.id} ${indice + 1}`
    const clausulas = entrada.split(' | ')
    assert.equal(clausulas.length, 3, `${referencia}: tres cláusulas`)
    const palabras = (texto) => texto.trim().split(/\s+/).length
    assert.ok(
      palabras(clausulas[1]) >= 25,
      `${referencia}: la interpretación debe tener al menos 25 palabras`,
    )
    assert.ok(
      palabras(clausulas[2]) >= 25,
      `${referencia}: la aplicación debe tener al menos 25 palabras`,
    )
  })
}

const lecturasIniciales = generarPlan(365)[0].lecturas
const nuevo = crearExtras(lecturasIniciales)
assert.equal(nuevo.preguntasEstudio.length, 3, 'deben sugerirse 3 preguntas de texto')
assert.equal(nuevo.preguntasAplicacion.length, 2, 'deben sugerirse 2 preguntas de aplicación')
assert.match(nuevo.preguntasAplicacion[1].texto, /Espíritu Santo/)

const nota = generarNotaExegetica(lecturasIniciales)
assert.match(nota, /1\) Observación/, 'la nota debe incluir el punto 1')
assert.match(nota, /2\) Interpretación/, 'la nota debe incluir el punto 2')
assert.match(nota, /3\) Aplicación cristocéntrica/, 'la nota debe incluir el punto 3')
assert.match(nota, /Génesis 1: Dios crea el cielo/, 'la observación debe ser del capítulo leído')
assert.match(nota, /Fuentes Reformadas Presbiterianas — /, 'la nota debe indicar las fuentes del día')
for (const obra of bibliografiaPara(lecturasIniciales)) {
  assert.ok(nota.includes(obra.replace(/\.$/, '')), `falta la fuente ${obra} en la nota`)
}
assert.equal(nuevo.notaExegetica, nota, 'la aplicación debe entregar la nota ya redactada')
for (const lectura of lecturasIniciales) {
  const [observacion, interpretacion, aplicacion] = TEMAS[lectura.libroId][lectura.capitulo - 1].split(' | ')
  const limpio = (texto) => texto.replace(/[.\s]+$/, '')
  assert.ok(nota.includes(limpio(observacion)), `falta la observación de ${lectura.libro} ${lectura.capitulo}`)
  assert.ok(nota.includes(limpio(interpretacion)), `falta la interpretación de ${lectura.libro} ${lectura.capitulo}`)
  assert.ok(nota.includes(limpio(aplicacion)), `falta la aplicación de ${lectura.libro} ${lectura.capitulo}`)
}

const diaFinal = generarPlan(365)[364]
const notaFinal = generarNotaExegetica(diaFinal.lecturas)
for (const lectura of diaFinal.lecturas) {
  assert.match(notaFinal, new RegExp(`${lectura.libro} ${lectura.capitulo}:`), 'cada capítulo se nombra en la nota')
}

assert.match(bibliografiaPara(lecturasIniciales).join('\n'), /Calvino/)
assert.match(bibliografiaPara(lecturasIniciales).join('\n'), /Westminster/)
assert.match(bibliografiaPara(generarPlan(365)[364].lecturas).join('\n'), /Hendriksen/)
const nota1Juan = generarNotaExegetica('1 Juan 2')
assert.match(nota1Juan, /1 Juan 2: La carta/, '«1 Juan» no debe leerse como «Juan»')
assert.doesNotMatch(nota1Juan, /Evangelio/)
const notaJuan = generarNotaExegetica('Juan 3')
assert.match(notaJuan, /Juan 3:/, '«Juan 3» debe resolver al evangelio')
assert.doesNotMatch(notaJuan, /1 Juan/)

const heredado = normalizarExtras({ titulo: 'Antiguo', preguntas: ['¿Qué revela el texto?'] })
assert.equal(heredado.preguntasEstudio[0].texto, '¿Qué revela el texto?')
assert.equal(heredado.preguntasAplicacion.length, 2)
const notaHeredada = normalizarExtras({ notaExegetica: '' }, lecturasIniciales)
assert.equal(notaHeredada.notaExegetica, nota, 'se debe completar la nota vacía del día')
const notaEditada = normalizarExtras(
  {
    notaExegetica: 'Nota personal del estudiante',
    notaExegeticaVersion: VERSION_NOTA,
    notaEditada: true,
  },
  lecturasIniciales,
)
assert.equal(notaEditada.notaExegetica, 'Nota personal del estudiante', 'no se debe borrar una nota editada')
const notaDesactualizada = normalizarExtras(
  { notaExegetica: nota.replace(/soberanía/g, 'poder'), notaExegeticaVersion: VERSION_NOTA - 1 },
  lecturasIniciales,
)
assert.equal(notaDesactualizada.notaExegetica, nota, 'la nota generada antigua se debe regenerar')
assert.equal(notaDesactualizada.notaEditada, false)

assert.equal(formatearSinAnio(new Date('2026-01-01T00:00:00')), '1 de enero')
assert.equal(formatearSinAnio(new Date('2026-12-31T00:00:00')), '31 de diciembre')

console.log('OK: cobertura, fechas sin año, nota en 3 puntos con bibliografía y estudio diario')
