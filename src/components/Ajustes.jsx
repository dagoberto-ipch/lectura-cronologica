import { useEffect, useState } from 'react'
import { CLAVE_ALMACENAMIENTO } from '../lib/almacenamiento.js'
import { hoyISO, inicioDelAnio } from '../lib/fechas.js'
import { TRADUCCIONES } from '../lib/enlaces.js'

export default function Ajustes({
  fechaInicio,
  traduccion,
  nombrePlan,
  onCambiarFechaInicio,
  onCambiarTraduccion,
  onReiniciar,
}) {
  const [anioInput, setAnioInput] = useState(String(Number(fechaInicio.slice(0, 4))))

  useEffect(() => {
    setAnioInput(String(Number(fechaInicio.slice(0, 4))))
  }, [fechaInicio])

  function confirmarAnio() {
    const anio = Number(anioInput)
    if (Number.isInteger(anio) && anio >= 1 && anio <= 9999) {
      onCambiarFechaInicio(inicioDelAnio(anio))
    } else {
      setAnioInput(String(Number(fechaInicio.slice(0, 4))))
    }
  }

  function reiniciar() {
    const confirmado = window.confirm(
      `¿Borrar el progreso y todas las notas del plan de ${nombrePlan}? Esta acción no se puede deshacer.`,
    )
    if (confirmado) onReiniciar()
  }

  return (
    <section className="vista" aria-labelledby="titulo-ajustes">
      <div className="vista-cabecera">
        <div>
          <h2 id="titulo-ajustes">Ajustes</h2>
          <p>Preferencias del plan y de la lectura.</p>
        </div>
      </div>

      <div className="bloque">
        <h3>Fecha de inicio</h3>
        <p>
          Elige cualquier año de inicio: el plan siempre corre del 1 de enero al 31 de diciembre
          (en el plan de 2 años, hasta el 31 de diciembre del año siguiente). Cambiar la fecha no
          borra tu progreso. Escribe el año y presiona Enter (o sal del campo) para aplicarlo.
        </p>
        <div className="fila-ajuste">
          <label className="campo-inline">
            <span>Año de inicio</span>
            <input
              type="number"
              min="1"
              max="9999"
              aria-label="Año de inicio"
              value={anioInput}
              onChange={(evento) => setAnioInput(evento.target.value)}
              onBlur={confirmarAnio}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter') confirmarAnio()
              }}
            />
          </label>
          <label className="campo-inline">
            <span>Fecha exacta</span>
            <input
              type="date"
              aria-label="Fecha de inicio"
              value={fechaInicio}
              onChange={(evento) => {
                if (evento.target.value) onCambiarFechaInicio(evento.target.value)
              }}
            />
          </label>
          <button
            type="button"
            className="boton-suave"
            onClick={() => onCambiarFechaInicio(inicioDelAnio())}
          >
            Año actual
          </button>
          <button type="button" className="boton-suave" onClick={() => onCambiarFechaInicio(hoyISO())}>
            Empezar hoy
          </button>
        </div>
      </div>

      <div className="bloque">
        <h3>Traducción para los enlaces</h3>
        <p>Los enlaces abren BibleGateway en una pestaña nueva. La app no incluye texto bíblico.</p>
        <label className="campo-inline">
          <span>Traducción</span>
          <select value={traduccion} onChange={(evento) => onCambiarTraduccion(evento.target.value)}>
            {TRADUCCIONES.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.id} — {opcion.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="bloque bloque-peligro">
        <h3>Reiniciar plan actual</h3>
        <p>
          Borra los días marcados y los campos de «Para este día» del plan de {nombrePlan}.
          El otro plan se conserva.
        </p>
        <button type="button" className="boton-peligro" onClick={reiniciar}>
          Borrar progreso de {nombrePlan}
        </button>
      </div>

      <div className="bloque">
        <h3>Datos guardados</h3>
        <p>
          Todo se guarda en el almacenamiento local del navegador bajo la clave{' '}
          <code>{CLAVE_ALMACENAMIENTO}</code>. No hay servidor, cuentas ni claves API.
          Si borras los datos del sitio en el navegador, se pierde el progreso.
        </p>
      </div>
    </section>
  )
}
