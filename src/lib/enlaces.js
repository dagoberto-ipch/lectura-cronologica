import { referenciaParaBusqueda } from './referencias.js'

export const TRADUCCIONES = [
  { id: 'NBLA', nombre: 'Nueva Biblia de las Américas' },
  { id: 'RVR1960', nombre: 'Reina-Valera 1960' },
  { id: 'RVA', nombre: 'Reina-Valera Actualizada' },
  { id: 'NVI', nombre: 'Nueva Versión Internacional' },
]

export function urlBibleGateway(lecturas, traduccion = 'NBLA') {
  const busqueda = referenciaParaBusqueda(lecturas)
  const version = TRADUCCIONES.some((item) => item.id === traduccion) ? traduccion : 'NBLA'
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(busqueda)}&version=${encodeURIComponent(version)}`
}
