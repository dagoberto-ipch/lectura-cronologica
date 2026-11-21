import { useMemo, useState } from 'react'
import { LIBROS_CRONOLOGICOS } from '../data/biblia.js'
import {
  diaDeHoy,
  fechaDelDia,
  formatearCorta,
  formatearSinAnio,
} from '../lib/fechas.js'
import { formatearReferencias } from '../lib/referencias.js'

const FILTROS = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'pendientes', nombre: 'Pendientes' },
  { id: 'completados', nombre: 'Completados' },
]

export default function Calendario({
  plan,
  completados,
  fechaInicio,
  diaSeleccionado,
  onAbrirDia,
  onCambiarFechaInicio,
}) {
  const [filtro, setFiltro] = useState('todos')
  const [libroFiltro, setLibroFiltro] = useState('')

  const diasVisibles = useMemo(
    () =>
      plan.filter((dia) => {
        const leido = Boolean(completados[dia.dia])
        if (filtro === 'pendientes' && leido) return false
        if (filtro === 'completados' && !leido) return false
        if (libroFiltro && !dia.lecturas.some((lectura) => lectura.libroId === libroFiltro)) {
          return false
        }
        return true
      }),
    [plan, completados, filtro, libroFiltro],
  )

  const hoy = diaDeHoy(fechaInicio, plan.length)
  const primerPendiente = plan.find((dia) => !completados[dia.dia])?.dia ?? plan.length

  return (
    <section className="vista" aria-labelledby="titulo-calendario">
      <div className="vista-cabecera">
        <div>
          <h2 id="titulo-calendario">Calendario de lectura</h2>
          <p>
            Comienza el {formatearSinAnio(fechaDelDia(fechaInicio, 1))}. Termina el{' '}
            {formatearSinAnio(fechaDelDia(fechaInicio, plan.length))}.
          </p>
        </div>
        <div className="acciones-calendario">
          <button type="button" className="boton-suave" onClick={() => onAbrirDia(hoy)}>
            Ir al día {hoy}
          </button>
          <button type="button" className="boton-suave" onClick={() => onAbrirDia(primerPendiente)}>
            Continuar lectura
          </button>
        </div>
      </div>

      <div className="barra-filtros">
        <div className="segmentos" role="group" aria-label="Filtrar días">
          {FILTROS.map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              className={filtro === opcion.id ? 'activo' : ''}
              onClick={() => setFiltro(opcion.id)}
            >
              {opcion.nombre}
            </button>
          ))}
        </div>

        <label className="campo-inline">
          <span>Libro</span>
          <select value={libroFiltro} onChange={(evento) => setLibroFiltro(evento.target.value)}>
            <option value="">Todos los libros</option>
            {LIBROS_CRONOLOGICOS.map((libro) => (
              <option key={libro.id} value={libro.id}>
                {libro.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="campo-inline">
          <span>Inicio</span>
          <input
            type="date"
            value={fechaInicio}
            onChange={(evento) => {
              if (evento.target.value) onCambiarFechaInicio(evento.target.value)
            }}
          />
        </label>
      </div>

      <p className="resultado-count">
        Mostrando {diasVisibles.length} de {plan.length} días
        {libroFiltro ? ` · ${LIBROS_CRONOLOGICOS.find((libro) => libro.id === libroFiltro)?.nombre}` : ''}
      </p>

      <div className="cuadricula-dias">
        {diasVisibles.map((dia) => {
          const leido = Boolean(completados[dia.dia])
          const esHoy = dia.dia === hoy
          return (
            <button
              key={dia.dia}
              type="button"
              className={`dia-boton ${leido ? 'leido' : ''} ${dia.dia === diaSeleccionado ? 'seleccionado' : ''} ${esHoy ? 'hoy' : ''}`}
              onClick={() => onAbrirDia(dia.dia)}
              title={formatearReferencias(dia.lecturas)}
            >
              <span className="dia-boton__top">
                <strong>{dia.dia}</strong>
                <small>{formatearCorta(fechaDelDia(fechaInicio, dia.dia))}</small>
              </span>
              <span className="dia-boton__ref">{formatearReferencias(dia.lecturas)}</span>
              <span className="dia-boton__marca" aria-hidden="true">
                {leido ? '✓' : esHoy ? '●' : ''}
              </span>
            </button>
          )
        })}
      </div>

      {diasVisibles.length === 0 && (
        <p className="vacio">No hay días con estos filtros.</p>
      )}

      <p className="nota-pie">
        Los cambios de fecha no alteran lo ya leído: solo recalculan las fechas del calendario.
        Hoy es {formatearSinAnio(new Date())}.
      </p>
    </section>
  )
}
