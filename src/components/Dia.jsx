import { VERSION_NOTA } from '../data/extras.js'
import { bibliografiaPara } from '../data/exegetica.js'
import { formatearSinAnio } from '../lib/fechas.js'
import { urlBibleGateway } from '../lib/enlaces.js'
import { formatearReferencias } from '../lib/referencias.js'

const SECCIONES_PREGUNTAS = [
  {
    campo: 'preguntasEstudio',
    titulo: 'Preguntas sobre el texto',
    descripcion: 'Destacan lo más importante de la sección leída.',
    etiqueta: 'pregunta de texto',
    agregar: '+ Agregar pregunta de texto',
  },
  {
    campo: 'preguntasAplicacion',
    titulo: 'Preguntas de aplicación',
    descripcion: 'Preguntas desafiantes para la reflexión práctica.',
    etiqueta: 'pregunta de aplicación',
    agregar: '+ Agregar pregunta de aplicación',
  },
]

export default function Dia({
  dia,
  totalDias,
  fecha,
  completado,
  extras,
  traduccion,
  onToggleCompletado,
  onCambiarExtras,
  onIr,
}) {
  const referencia = formatearReferencias(dia.lecturas)
  const bibliografia = bibliografiaPara(dia.lecturas)
  const actualizar = (cambios) => onCambiarExtras({ ...extras, ...cambios })

  const cambiarPregunta = (campo, indice, clave, valor) =>
    actualizar({
      [campo]: extras[campo].map((pregunta, i) =>
        i === indice ? { ...pregunta, [clave]: valor } : pregunta,
      ),
    })

  const agregarPregunta = (campo) =>
    actualizar({ [campo]: [...extras[campo], { texto: '', respuesta: '' }] })

  const quitarPregunta = (campo, indice) =>
    actualizar({ [campo]: extras[campo].filter((_, i) => i !== indice) })

  const cambiarRecurso = (indice, campo, valor) =>
    actualizar({
      recursos: extras.recursos.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)),
    })

  const cambiarClavePersonalizada = (claveAnterior, claveNueva) => {
    const resultado = {}
    for (const [clave, valor] of Object.entries(extras.personalizado)) {
      resultado[clave === claveAnterior ? claveNueva : clave] = valor
    }
    actualizar({ personalizado: resultado })
  }

  const agregarCampoPersonalizado = () => {
    let clave = `campo${Object.keys(extras.personalizado).length + 1}`
    while (clave in extras.personalizado) clave += '1'
    actualizar({ personalizado: { ...extras.personalizado, [clave]: '' } })
  }

  return (
    <section className="vista" aria-labelledby="titulo-dia">
      <div className="vista-cabecera dia-cabecera">
        <div>
          <p className="etiqueta">Día {dia.dia} de {totalDias}</p>
          <h2 id="titulo-dia">{referencia}</h2>
          <p className="fecha-dia">{formatearSinAnio(fecha)}</p>
        </div>
        <div className="acciones-dia">
          <button type="button" className="boton-suave" onClick={() => onIr(dia.dia - 1)} disabled={dia.dia === 1}>
            ← Anterior
          </button>
          <button
            type="button"
            className="boton-suave"
            onClick={() => onIr(dia.dia + 1)}
            disabled={dia.dia === totalDias}
          >
            Siguiente →
          </button>
        </div>
      </div>

      <div className={`bandera-estado ${completado ? 'completado' : ''}`}>
        <span>{completado ? 'Lectura completada' : 'Lectura pendiente'}</span>
        <button type="button" onClick={onToggleCompletado}>
          {completado ? 'Marcar como pendiente' : 'Marcar como leído ✓'}
        </button>
      </div>

      <div className="bloque">
        <div className="bloque-titulo">
          <h3>Lecturas de hoy</h3>
          <a
            className="enlace-leer"
            href={urlBibleGateway(dia.lecturas, traduccion)}
            target="_blank"
            rel="noreferrer"
          >
            Leer todo en {traduccion} ↗
          </a>
        </div>
        <ul className="lista-lecturas">
          {dia.lecturas.map((lectura, indice) => (
            <li key={`${lectura.libroId}-${lectura.capitulo}-${indice}`}>
              <span className="lectura-ref">{lectura.libro} {lectura.capitulo}</span>
              <span className="lectura-testamento">{lectura.testamento}</span>
              <a
                href={urlBibleGateway([lectura], traduccion)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Leer ${lectura.libro} ${lectura.capitulo} en ${traduccion}`}
              >
                Leer ↗
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="aviso-cuaderno">
        <strong>📓 Cuaderno de notas</strong>
        <p>
          Te sugiero tener un cuaderno a mano y registrar allí todo lo estudiado en el día:
          observaciones, preguntas, respuestas, oraciones y lo que Dios te habla por su Espíritu.
          Tus respuestas también quedan guardadas aquí para que puedas hacerles seguimiento.
        </p>
      </div>

      <div className="bloque">
        <div className="bloque-titulo">
          <h3>Para este día</h3>
          <span className="guardado">Se guarda automáticamente</span>
        </div>

        <div className="campo">
          <label htmlFor="extra-titulo">Tema o título del día</label>
          <input
            id="extra-titulo"
            type="text"
            placeholder="Ej. La llamada de Abram"
            value={extras.titulo}
            onChange={(evento) => actualizar({ titulo: evento.target.value })}
          />
        </div>

        <div className="campo">
          <label htmlFor="extra-versiculo">Versículo clave</label>
          <input
            id="extra-versiculo"
            type="text"
            placeholder="Ej. Génesis 12:1–3"
            value={extras.versiculoClave}
            onChange={(evento) => actualizar({ versiculoClave: evento.target.value })}
          />
        </div>

        <div className="campo">
          <label htmlFor="extra-exegetica" className="etiqueta-nota">
            Nota exegética · visión Reformada Presbiteriana
            <span className="etiqueta-ia">Generado con IA</span>
          </label>
          <textarea
            id="extra-exegetica"
            rows={12}
            value={extras.notaExegetica}
            onChange={(evento) =>
              actualizar({
                notaExegetica: evento.target.value,
                notaExegeticaVersion: VERSION_NOTA,
                notaEditada: true,
              })
            }
          />
          <p className="ayuda">
            Texto generado con IA: redacta los tres puntos —1) Observación, 2) Interpretación y
            3) Aplicación cristocéntrica— para cada capítulo leído hoy, desde una perspectiva
            Reformada Presbiteriana, e indica al final las fuentes seleccionadas para el día.
            Revísalo y complétalo con lo que descubras en tu lectura.
          </p>
          <div className="bibliografia">
            <strong>Bibliografía Reformada Presbiteriana</strong>
            <ul>
              {bibliografia.map((obra) => (
                <li key={obra}>{obra}</li>
              ))}
            </ul>
          </div>
        </div>

        {SECCIONES_PREGUNTAS.map((seccion) => (
          <div className="campo" key={seccion.campo}>
            <span className="etiqueta-campo">{seccion.titulo}</span>
            <p className="ayuda">{seccion.descripcion}</p>

            {extras[seccion.campo].map((pregunta, indice) => (
              <div className="pregunta-card" key={indice}>
                <div className="fila-multiple">
                  <input
                    type="text"
                    aria-label={`${seccion.etiqueta} ${indice + 1}`}
                    placeholder="Escribe la pregunta…"
                    value={pregunta.texto}
                    onChange={(evento) =>
                      cambiarPregunta(seccion.campo, indice, 'texto', evento.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="boton-icono"
                    aria-label={`Quitar ${seccion.etiqueta} ${indice + 1}`}
                    onClick={() => quitarPregunta(seccion.campo, indice)}
                  >
                    ×
                  </button>
                </div>
                <label className="respuesta-label" htmlFor={`respuesta-${seccion.campo}-${indice}`}>
                  Tu respuesta
                </label>
                <textarea
                  id={`respuesta-${seccion.campo}-${indice}`}
                  rows={3}
                  placeholder="Escribe aquí tu respuesta; queda guardada para tu seguimiento…"
                  value={pregunta.respuesta}
                  onChange={(evento) =>
                    cambiarPregunta(seccion.campo, indice, 'respuesta', evento.target.value)
                  }
                />
              </div>
            ))}

            <button
              type="button"
              className="boton-suave"
              onClick={() => agregarPregunta(seccion.campo)}
            >
              {seccion.agregar}
            </button>
          </div>
        ))}

        <div className="campo">
          <label htmlFor="extra-notas">Notas</label>
          <textarea
            id="extra-notas"
            rows={6}
            placeholder="Escribe aquí tus observaciones, oraciones o resumen…"
            value={extras.notas}
            onChange={(evento) => actualizar({ notas: evento.target.value })}
          />
        </div>

        <div className="campo">
          <span className="etiqueta-campo">Recursos</span>
          {extras.recursos.map((recurso, indice) => (
            <div className="fila-multiple" key={indice}>
              <input
                type="text"
                aria-label={`Etiqueta del recurso ${indice + 1}`}
                placeholder="Etiqueta"
                value={recurso.etiqueta}
                onChange={(evento) => cambiarRecurso(indice, 'etiqueta', evento.target.value)}
              />
              <input
                type="url"
                aria-label={`URL del recurso ${indice + 1}`}
                placeholder="https://…"
                value={recurso.url}
                onChange={(evento) => cambiarRecurso(indice, 'url', evento.target.value)}
              />
              <button
                type="button"
                className="boton-icono"
                aria-label={`Quitar recurso ${indice + 1}`}
                onClick={() =>
                  actualizar({ recursos: extras.recursos.filter((_, i) => i !== indice) })
                }
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="boton-suave"
            onClick={() => actualizar({ recursos: [...extras.recursos, { etiqueta: '', url: '' }] })}
          >
            + Agregar recurso
          </button>
        </div>

        <div className="campo">
          <span className="etiqueta-campo">Campos personalizados</span>
          <p className="ayuda">Espacio libre para lo que quieras añadir a este día.</p>
          {Object.entries(extras.personalizado).map(([clave, valor], indice) => (
            <div className="fila-multiple" key={indice}>
              <input
                type="text"
                aria-label="Nombre del campo"
                value={clave}
                onChange={(evento) => cambiarClavePersonalizada(clave, evento.target.value)}
              />
              <input
                type="text"
                aria-label={`Valor de ${clave}`}
                value={valor}
                onChange={(evento) =>
                  actualizar({ personalizado: { ...extras.personalizado, [clave]: evento.target.value } })
                }
              />
              <button
                type="button"
                className="boton-icono"
                aria-label={`Quitar campo ${clave}`}
                onClick={() => {
                  const copia = { ...extras.personalizado }
                  delete copia[clave]
                  actualizar({ personalizado: copia })
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className="boton-suave" onClick={agregarCampoPersonalizado}>
            + Agregar campo
          </button>
        </div>
      </div>
    </section>
  )
}
