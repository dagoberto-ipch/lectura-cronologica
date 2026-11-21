import { useState } from 'react'
import { formatearSinAnio } from '../lib/fechas.js'

function Barra({ valor, total, porcentaje }) {
  return (
    <div className="barra" role="img" aria-label={`${porcentaje}% completado`}>
      <div className="barra__relleno" style={{ width: `${Math.min(100, Math.max(0, porcentaje))}%` }} />
      <span className="barra__texto">{valor} / {total}</span>
    </div>
  )
}

export default function Estadisticas({ estadisticas, nombrePlan }) {
  const [mostrarTodos, setMostrarTodos] = useState(false)

  const librosVisibles = mostrarTodos
    ? estadisticas.libros
    : estadisticas.libros.filter((libro) => libro.capitulosLeidos > 0)

  return (
    <section className="vista" aria-labelledby="titulo-estadisticas">
      <div className="vista-cabecera">
        <div>
          <h2 id="titulo-estadisticas">Tu progreso</h2>
          <p>Plan de {nombrePlan} · término: {formatearSinAnio(estadisticas.fechaFin)}</p>
        </div>
      </div>

      <div className="tarjetas">
        <div className="tarjeta">
          <span className="tarjeta__numero">{estadisticas.porcentajeDias}%</span>
          <span className="tarjeta__etiqueta">días completados</span>
          <small>{estadisticas.diasLeidos} de {estadisticas.diasTotales} · faltan {estadisticas.diasRestantes}</small>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__numero">{estadisticas.porcentajeCapitulos}%</span>
          <span className="tarjeta__etiqueta">capítulos leídos</span>
          <small>{estadisticas.capitulosLeidos} de {estadisticas.totalCapitulos}</small>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__numero">{estadisticas.mejorRacha}</span>
          <span className="tarjeta__etiqueta">mejor racha de días</span>
          <small>lecturas consecutivas</small>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__numero">{estadisticas.librosCompletos}<small>/66</small></span>
          <span className="tarjeta__etiqueta">libros completos</span>
          <small>antiguo y nuevo testamento</small>
        </div>
        <div className="tarjeta">
          <span className="tarjeta__numero">{estadisticas.preguntasRegistradas}</span>
          <span className="tarjeta__etiqueta">respuestas registradas</span>
          <small>seguimiento de tu estudio personal</small>
        </div>
      </div>

      <div className="bloque">
        <h3>Por testamento</h3>
        {estadisticas.testamentos.map((testamento) => (
          <div className="fila-progreso" key={testamento.id}>
            <div className="fila-progreso__cabecera">
              <strong>{testamento.nombre}</strong>
              <span>{testamento.porcentaje}%</span>
            </div>
            <Barra
              valor={testamento.leidos}
              total={testamento.capitulos}
              porcentaje={testamento.porcentaje}
            />
          </div>
        ))}
      </div>

      <div className="bloque">
        <div className="bloque-titulo">
          <h3>Por libro</h3>
          <button type="button" className="boton-suave" onClick={() => setMostrarTodos((valor) => !valor)}>
            {mostrarTodos ? 'Mostrar solo iniciados' : 'Mostrar los 66 libros'}
          </button>
        </div>

        {librosVisibles.length === 0 && (
          <p className="vacio">Aún no has marcado ninguna lectura como completada.</p>
        )}

        <div className="lista-libros">
          {librosVisibles.map((libro) => (
            <div className="fila-libro" key={libro.id}>
              <span>{libro.nombre}</span>
              <Barra
                valor={libro.capitulosLeidos}
                total={libro.capitulos}
                porcentaje={libro.porcentaje}
              />
              <small>{libro.porcentaje}%</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
