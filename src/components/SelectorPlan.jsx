export default function SelectorPlan({ planes, value, onChange }) {
  return (
    <div className="selector-plan" role="group" aria-label="Duración del plan">
      {planes.map((plan) => {
        const activo = plan.id === value
        return (
          <button
            key={plan.id}
            type="button"
            className={`selector-plan__boton ${activo ? 'activo' : ''}`}
            aria-pressed={activo}
            onClick={() => onChange(plan.id)}
          >
            <strong>{plan.nombre}</strong>
            <small>{plan.dias} días</small>
          </button>
        )
      })}
    </div>
  )
}
