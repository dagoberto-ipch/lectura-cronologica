# Lectura Cronológica

Lectura cronológica completa de la Biblia en planes de 1 y 2 años, con seguimiento personal y material de estudio por día.

Documentación: [descripción, objetivo, modo de uso y ventajas de las modalidades](DOCUMENTACION.md).

## Características

- 66 libros y 1189 capítulos en orden cronológico, sin omisiones ni repeticiones.
- Planes de 1 y 2 años que siempre comienzan el 1 de enero y terminan el 31 de diciembre.
- Año de inicio cualquiera.
- Texto bíblico no incrustado: cada lectura enlaza a BibleGateway.
- Nota exegética generada con IA para cada capítulo del día, en tres puntos: observación, interpretación Reformada Presbiteriana y aplicación cristocéntrica, con las fuentes seleccionadas para el día.
- Tres preguntas de texto y dos de aplicación, con respuestas guardadas en `localStorage`.
- Sin backend, sin credenciales y sin dependencias externas de IA.

## Desarrollo local

Requiere Node.js 18 o superior.

```bash
npm ci
npm run dev
```

Verificaciones:

```bash
npm run verificar
npm run build
```

## Despliegue

La rama `gh-pages` contiene el sitio compilado (`npm run build`) y se publica mediante GitHub Pages.
Para actualizarlo: compilar, copiar el contenido de `dist/` a la rama `gh-pages` y hacer push.

---

Pr. Dagoberto Peñaloza Aravena · Pastor Presbiteriano
