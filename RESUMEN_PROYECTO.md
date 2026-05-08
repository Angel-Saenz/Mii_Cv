# Resumen del Proyecto: Portafolio Inmersivo 3D - Ángel Saenz

Este documento contiene el contexto técnico y funcional del portafolio desarrollado el 23 de abril de 2026.

## 1. Visión General
Se ha creado un sitio web personal inmersivo para un Ingeniero en Tecnologías de la Información, utilizando tecnologías modernas de renderizado 3D y animaciones fluidas.

## 2. Tech Stack
- **Framework:** React 19 (TypeScript) + Vite.
- **3D Engine:** Three.js con @react-three/fiber y @react-three/drei.
- **Animaciones:** Framer Motion (para interfaz HTML y efectos de partículas).
- **Iconografía:** Lucide React.
- **Estilos:** CSS-in-JS (Styled Components patterns) con Glassmorphism premium.

## 3. Características Principales

### A. Experiencia Inmersiva Dual
- **Modo Oscuro (Espacio):** Fondo de estrellas dinámicas con una esfera de cristal distorsionada en color cyan neón.
- **Modo Claro (Cielo):** Fondo de azul cielo con nubes volumétricas flotantes y una bandada de pájaros poligonales volando a lo lejos.

### B. Efectos de Interacción Elite
- **Onda de Proximidad:** El nombre "ÁNGEL ELIUD SAENZ TORRES" reacciona al ratón con un efecto de ola donde las letras adyacentes se elevan suavemente.
- **Polvo Cósmico:** Partículas de luz salen disparadas de cada letra al interactuar con ellas, desapareciendo con un efecto de dispersión.
- **Entrada Lateral:** Las secciones de la página aparecen deslizándose desde los bordes de la pantalla (izquierda y derecha alternadamente) al hacer scroll.

### C. Contenido del CV (Sincronizado)
- **Experiencia Laboral:** Detalle completo de Eagle Importación (incluyendo Stored Procedures y mantenimiento de redes), ALIRU (catálogo de productos) y Estancias en la Universidad Politécnica de Gómez Palacio.
- **Educación:** Ingeniería en TI y Bachillerato en Cobaed 35.
- **Habilidades:** Sección de Soft Skills (Trabajo con IA, Pensamiento Crítico, etc.) y Tech Stack completo.

### D. Detalles Profesionales
- **Botón de Descarga:** Diseño de cápsula con efecto de barrido de luz (reflejo) al pasar el ratón.
- **Favicon Personalizado:** Icono de código `</>` en la pestaña del navegador.

## 4. Instrucciones de Despliegue
Para subir el sitio a un hosting:
1. Ejecutar `npm run build` para generar la carpeta `dist`.
2. Subir el contenido de `dist` a la carpeta raíz del servidor (ej. `public_html`).
3. Asegurarse de subir el archivo `Mi CV.pdf` a la misma raíz para que el botón de descarga funcione.

---
*Documento generado automáticamente por Gemini CLI para el proyecto de Ángel Eliud Saenz Torres.*
