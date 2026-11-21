# Lectura Cronológica

**Toda la Biblia, en orden de los acontecimientos**

Pr. Dagoberto Peñaloza Aravena · Pastor Presbiteriano

---

## 1. Descripción de la aplicación

Lectura Cronológica es una aplicación web para leer la Biblia completa en orden cronológico, en un plan de **1 año** o de **2 años**, con seguimiento personal y material de estudio para cada día.

Está construida con React y Vite y se publica como un sitio estático en GitHub Pages. No tiene servidor propio, cuentas de usuario ni credenciales: todo el progreso se guarda en el almacenamiento local del navegador.

### Qué incluye

- **66 libros y 1189 capítulos** distribuidos en orden cronológico, sin omisiones ni repeticiones.
- **Planes de 365/366 y 730/731 días**, siempre del 1 de enero al 31 de diciembre, con cualquier año de inicio.
- **Sin texto bíblico incrustado.** Cada lectura abre el pasaje en BibleGateway, en la versión elegida: NBLA, RVR1960, RVA o NVI.
- **Nota exegética generada con IA para cada capítulo del día**, en tres puntos —Observación, Interpretación y Aplicación cristocéntrica— con un tono pastoral, cercano y reverente.
- **Fuentes Reformadas Presbiterianas** al final de la nota, seleccionadas según los libros que se leen ese día.
- **Preguntas sobre el texto y de aplicación**, con respuestas editables y guardadas automáticamente.
- **Cuaderno de notas, recursos y campos personalizados** para cada día.
- **Estadísticas de progreso**: días y capítulos leídos, racha consecutiva, libros completos, avance por testamento y por libro.
- Diseño adaptable: funciona igual en computador y en celular.

La nota exegética es orientativa y está marcada como **Generado con IA**. Puede ser revisada, corregida y completada por el estudiante; los cambios quedan conservados.

---

## 2. Objetivo general

Acompañar al estudiante de la Biblia a completar la lectura de los 66 libros en orden cronológico durante un año o dos, ofreciendo un ritmo de lectura claro, herramientas de estudio desde la fe **Reformada Presbiteriana** y un registro personal del progreso, sin depender de un servidor ni de credenciales de acceso.

De manera concreta, la aplicación busca que quien la use:

- Recorra la Biblia completa sin perder el hilo de la historia bíblica.
- Entienda cada capítulo a la luz de su contexto, con una interpretación y una aplicación centradas en Cristo.
- Registre observaciones, respuestas y oraciones que pueda revisar más adelante.
- Mantenga una rutina de lectura visible y motivadora, en el ritmo que mejor se ajuste a su vida.

---

## 3. Modo de operación y cómo usarlo

### Acceso

La aplicación se abre directamente en el navegador, desde el enlace publicado. No requiere instalación ni inicio de sesión. Se recomienda usar siempre el mismo navegador y dispositivo para conservar el progreso, porque los datos no se sincronizan entre equipos.

### Paso 1: elegir la modalidad de lectura

En la cabecera se selecciona **1 año** o **2 años**. El cambio de plan no borra lo ya leído: cada plan conserva su propio progreso y sus propias notas.

### Paso 2: ajustar el calendario y la traducción

En la vista **Ajustes** se puede:

- Definir el **año de inicio** o una fecha exacta. El plan siempre termina el 31 de diciembre del año correspondiente; en el plan de 2 años, el 31 de diciembre del año siguiente.
- Volver al **año actual** o hacer que el plan **empiece hoy**.
- Elegir la **traducción** de los enlaces a BibleGateway.
- Reiniciar el plan actual si se desea empezar de nuevo. Cambiar la fecha no borra el progreso; el reinicio sí.

### Paso 3: ubicarse en el calendario

La vista **Calendario** muestra los días del plan con su fecha y sus lecturas. Permite:

- Filtrar entre **Todos**, **Pendientes** y **Completados**.
- Buscar los días que contienen un libro determinado.
- Ir al día de hoy o continuar en el primer día pendiente.
- Abrir cualquier día tocando su tarjeta.

### Paso 4: estudiar el día

La vista **Día** contiene:

1. **Lecturas de hoy.** Enlace para leer todo el conjunto en BibleGateway y un enlace independiente para cada capítulo.
2. **Nota exegética.** Los tres puntos —Observación, Interpretación y Aplicación cristocéntrica— para cada capítulo, seguidos de las fuentes del día. Es un texto editable.
3. **Preguntas sobre el texto y de aplicación.** Cada pregunta se puede modificar o eliminar, y admite una respuesta escrita. El recuadro se ajusta al contenido, tanto en computador como en celular.
4. **Notas, recursos y campos personalizados.** Espacio libre para observaciones, oraciones, enlaces y lo que el estudiante quiera añadir.
5. **Marcar como leído.** El botón actualiza el porcentaje general, la racha y las estadísticas.

Los botones **Anterior** y **Siguiente** permiten recorrer el plan día por día.

### Paso 5: revisar el progreso

La vista **Estadísticas** muestra el porcentaje de días y capítulos completados, la mejor racha, los libros terminados y el número de respuestas registradas, además del avance por testamento y por libro.

### Guardado de la información

Cada cambio se guarda automáticamente en el navegador bajo la clave `lectura-cronologica:v1`. No hay servidor, cuentas ni claves API. Si se borran los datos del sitio en el navegador, se pierde el progreso. Cuando cambia el contenido generado, las notas automáticas se actualizan; las notas editadas por el estudiante se conservan.

---

## 4. Ventajas en las modalidades y sus cualidades

### Modalidad de 1 año

| Cualidad | Descripción |
| --- | --- |
| Duración | 365 o 366 días, del 1 de enero al 31 de diciembre. |
| Ritmo | 3 o 4 capítulos por día. |
| Ventaja principal | Ofrece una visión completa y continua de la Biblia en el menor tiempo, sin fragmentar la historia bíblica. |
| Ideal para | Quienes ya tienen hábito de lectura, desean una meta anual concreta o preparan un discipulado con seguimiento semanal. |
| Cualidades | Constancia, panorama de conjunto, avance visible y variedad diaria de géneros bíblicos. |

### Modalidad de 2 años

| Cualidad | Descripción |
| --- | --- |
| Duración | 730 o 731 días, del 1 de enero al 31 de diciembre del año siguiente. |
| Ritmo | 1 o 2 capítulos por día. |
| Ventaja principal | Deja tiempo para meditar, escribir y conversar sobre lo leído, sin la presión de avanzar varios capítulos diarios. |
| Ideal para | Quienes comienzan a leer la Biblia, leen en familia, estudian con otras personas o prefieren un ritmo pausado. |
| Cualidades | Profundidad, sostenibilidad, espacio para la reflexión y menor carga diaria. |

### Cualidades comunes a ambas modalidades

- **Mismo contenido y misma calidad de estudio.** Los dos planes recorren los 1189 capítulos y ofrecen nota exegética, preguntas y bibliografía para cada día.
- **Progreso independiente.** Se puede alternar entre un plan y otro sin perder lo ya avanzado en cada uno.
- **Fechas flexibles.** El año de inicio es libre y el calendario se recalcula sin alterar el progreso.
- **Enfoque cristocéntrico.** Cada capítulo se relaciona con Cristo y con la vida concreta del estudiante.
- **Perspectiva Reformada Presbiteriana.** La interpretación y la bibliografía se sostienen en esa tradición, con lenguaje pastoral y comprensible.
- **Privacidad y simplicidad.** Sin cuentas, sin claves y sin envío de datos personales a un servidor.
- **Acceso en cualquier dispositivo.** La interfaz se adapta al tamaño de la pantalla, en computador y en celular.

---

Pr. Dagoberto Peñaloza Aravena · Pastor Presbiteriano
