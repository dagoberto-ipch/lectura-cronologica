import { useMemo, useState } from 'react'
import Ajustes from './components/Ajustes.jsx'
import Calendario from './components/Calendario.jsx'
import Dia from './components/Dia.jsx'
import Estadisticas from './components/Estadisticas.jsx'
import SelectorPlan from './components/SelectorPlan.jsx'
import { crearExtras, normalizarExtras } from './data/extras.js'
import { obtenerConfigPlan, obtenerPlan, PLANES } from './data/plan.js'
import { cargarEstado, guardarEstado } from './lib/almacenamiento.js'
import { diaDeHoy, fechaDelDia } from './lib/fechas.js'
import { calcularEstadisticas } from './lib/estadisticas.js'

const PESTANAS = [
  { id: 'calendario', nombre: 'Calendario' },
  { id: 'dia', nombre: 'Día' },
  { id: 'estadisticas', nombre: 'Estadísticas' },
  { id: 'ajustes', nombre: 'Ajustes' },
]

export default function App() {
  const [estado, setEstado] = useState(cargarEstado)
  const [vista, setVista] = useState('calendario')
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)

  function actualizarEstado(transformar) {
    setEstado((previo) => {
      const siguiente = transformar(previo)
      guardarEstado(siguiente)
      return siguiente
    })
  }

  const plan = useMemo(
    () => obtenerPlan(estado.plan, estado.fechaInicio),
    [estado.plan, estado.fechaInicio],
  )
  const planesDisponibles = useMemo(
    () =>
      PLANES.map((opcion) => ({
        ...opcion,
        dias: obtenerPlan(opcion.id, estado.fechaInicio).length,
      })),
    [estado.fechaInicio],
  )
  const configPlan = { ...obtenerConfigPlan(estado.plan), dias: plan.length }
  const completados = estado.completados[estado.plan] ?? {}
  const extrasDelPlan = estado.extras[estado.plan] ?? {}
  const estadisticas = useMemo(
    () => calcularEstadisticas(plan, completados, estado.fechaInicio, extrasDelPlan),
    [plan, completados, estado.fechaInicio, extrasDelPlan],
  )

  const numeroDia = Math.min(
    Math.max(diaSeleccionado ?? diaDeHoy(estado.fechaInicio, plan.length), 1),
    plan.length,
  )
  const diaActual = plan[numeroDia - 1]
  const extrasGuardados = extrasDelPlan[numeroDia]
  const extrasActuales = extrasGuardados
    ? normalizarExtras(extrasGuardados, diaActual.lecturas)
    : crearExtras(diaActual.lecturas)

  function cambiarPlan(idPlan) {
    if (idPlan === estado.plan) return
    actualizarEstado((previo) => ({ ...previo, plan: idPlan }))
    setDiaSeleccionado(null)
    setVista('calendario')
  }

  function abrirDia(numero) {
    setDiaSeleccionado(Math.min(Math.max(numero, 1), plan.length))
    setVista('dia')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function alternarCompletado() {
    const numero = numeroDia
    actualizarEstado((previo) => {
      const actuales = previo.completados[previo.plan] ?? {}
      return {
        ...previo,
        completados: {
          ...previo.completados,
          [previo.plan]: { ...actuales, [numero]: !actuales[numero] },
        },
      }
    })
  }

  function cambiarExtras(nuevosExtras) {
    const numero = numeroDia
    actualizarEstado((previo) => ({
      ...previo,
      extras: {
        ...previo.extras,
        [previo.plan]: { ...previo.extras[previo.plan], [numero]: nuevosExtras },
      },
    }))
  }

  function cambiarFechaInicio(fechaInicio) {
    actualizarEstado((previo) => ({ ...previo, fechaInicio }))
  }

  function cambiarTraduccion(traduccion) {
    actualizarEstado((previo) => ({ ...previo, traduccion }))
  }

  function reiniciarPlan() {
    actualizarEstado((previo) => ({
      ...previo,
      completados: { ...previo.completados, [previo.plan]: {} },
      extras: { ...previo.extras, [previo.plan]: {} },
    }))
    setVista('calendario')
  }

  return (
    <div className="app">
      <header className="cabecera">
        <div className="cabecera__marca">
          <span className="escudo" aria-hidden="true">✦</span>
          <div>
            <h1>Lectura Cronológica</h1>
            <p>Toda la Biblia, en orden de los acontecimientos</p>
            <p className="cabecera__autor">
              Pr. Dagoberto Peñaloza Aravena · Pastor Presbiteriano
            </p>
          </div>
        </div>
        <SelectorPlan planes={planesDisponibles} value={estado.plan} onChange={cambiarPlan} />
      </header>

      <div className="progreso-general">
        <div className="progreso-general__texto">
          <span>Plan de {configPlan.nombre}</span>
          <strong>{estadisticas.porcentajeDias}%</strong>
        </div>
        <div className="barra">
          <div
            className="barra__relleno"
            style={{ width: `${estadisticas.porcentajeDias}%` }}
          />
          <span className="barra__texto">
            {estadisticas.diasLeidos} / {estadisticas.diasTotales} días
          </span>
        </div>
        <small>
          {configPlan.descripcion} · {estadisticas.capitulosLeidos} de {estadisticas.totalCapitulos} capítulos
        </small>
      </div>

      <nav className="pestanas" aria-label="Vistas de la app">
        {PESTANAS.map((pestana) => (
          <button
            key={pestana.id}
            type="button"
            className={vista === pestana.id ? 'activo' : ''}
            aria-current={vista === pestana.id ? 'page' : undefined}
            onClick={() => setVista(pestana.id)}
          >
            {pestana.nombre}
            {pestana.id === 'dia' && <small> {numeroDia}</small>}
          </button>
        ))}
      </nav>

      <main>
        {vista === 'calendario' && (
          <Calendario
            plan={plan}
            completados={completados}
            fechaInicio={estado.fechaInicio}
            diaSeleccionado={numeroDia}
            onAbrirDia={abrirDia}
            onCambiarFechaInicio={cambiarFechaInicio}
          />
        )}

        {vista === 'dia' && (
          <Dia
            dia={diaActual}
            totalDias={plan.length}
            fecha={fechaDelDia(estado.fechaInicio, numeroDia)}
            completado={Boolean(completados[numeroDia])}
            extras={extrasActuales}
            traduccion={estado.traduccion}
            onToggleCompletado={alternarCompletado}
            onCambiarExtras={cambiarExtras}
            onIr={abrirDia}
          />
        )}

        {vista === 'estadisticas' && (
          <Estadisticas estadisticas={estadisticas} nombrePlan={configPlan.nombre} />
        )}

        {vista === 'ajustes' && (
          <Ajustes
            fechaInicio={estado.fechaInicio}
            traduccion={estado.traduccion}
            nombrePlan={configPlan.nombre}
            onCambiarFechaInicio={cambiarFechaInicio}
            onCambiarTraduccion={cambiarTraduccion}
            onReiniciar={reiniciarPlan}
          />
        )}
      </main>

      <footer className="pie">
        <p>
          66 libros · 1189 capítulos · planes de 1 o 2 años desde el 1 de enero. Los enlaces
          abren BibleGateway en una pestaña nueva.
        </p>
        <p className="pie__nota">Nota exegética generada con IA · Revisable y editable por el estudiante</p>
      </footer>
    </div>
  )
}
