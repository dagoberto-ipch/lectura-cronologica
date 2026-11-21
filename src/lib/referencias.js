// Agrupa capítulos consecutivos del mismo libro en un solo rango.
export function agruparLecturas(lecturas = []) {
  const grupos = []

  for (const lectura of lecturas) {
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.libroId === lectura.libroId && lectura.capitulo === ultimo.hasta + 1) {
      ultimo.hasta = lectura.capitulo
    } else {
      grupos.push({
        libroId: lectura.libroId,
        libro: lectura.libro,
        desde: lectura.capitulo,
        hasta: lectura.capitulo,
      })
    }
  }

  return grupos
}

function formatearGrupo(grupo) {
  return grupo.desde === grupo.hasta
    ? `${grupo.libro} ${grupo.desde}`
    : `${grupo.libro} ${grupo.desde}–${grupo.hasta}`
}

export function formatearReferencias(lecturas = []) {
  return agruparLecturas(lecturas).map(formatearGrupo).join('; ')
}

// Formato apto para el parámetro `search` de BibleGateway.
export function referenciaParaBusqueda(lecturas = []) {
  return agruparLecturas(lecturas)
    .map((grupo) =>
      grupo.desde === grupo.hasta
        ? `${grupo.libro} ${grupo.desde}`
        : `${grupo.libro} ${grupo.desde}-${grupo.hasta}`,
    )
    .join(';')
}
