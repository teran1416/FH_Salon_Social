# FH_Salon_Social
FH Salón Social es una landing page moderna y elegante para un salón de eventos en Palmira (Valle del Cauca). El objetivo es mostrar el espacio, transmitir confianza y dirigir todo el contacto hacia WhatsApp y redes sociales.

Tecnologías usadas
HTML5 – estructura semántica.
Tailwind CSS (CDN) + CSS personalizado (styles.css) – diseño responsive, estilo lujo (vino + dorado), glassmorphism, hovers, etc.
JavaScript (script.js) – navegación suave, menú móvil, enlaces dinámicos a WhatsApp, galería con lightbox, año automático en el footer.
AOS (Animate On Scroll) – animaciones suaves al hacer scroll.
🧱 Estructura principal
index.html
Navbar fija con logo de FH y botón “Solicitar cotización” (abre WhatsApp).
Hero con imagen de fondo, claim principal y botones hacia servicios/WhatsApp.
Secciones:
Sobre nosotros – descripción del salón y sus ventajas.
Servicios – tarjetas para bodas, cumpleaños, quinceañeros, eventos empresariales, etc.
Galería – grid de fotos (URLs externas), con efecto hover y lightbox.
Testimonios – tarjetas con reseñas destacadas (Adriana M., Yizeth O., Carlos R.) y un iframe de Google Maps mostrando la ficha de FH Salón Social + enlace directo a todas las reseñas.
Footer con navegación secundaria y año dinámico.
Botón flotante de WhatsApp (usa whatsapp.jpg en la raíz).
styles.css
Paleta basada en vino + dorado.
Estilos globales, tipografía, hero, tarjetas, botones, iconos, lightbox, etc.
Clases especiales como .wa-float (botón flotante) y .wa-icon (iconos de WhatsApp en botones).
script.js
Configuración de WhatsApp: número +57 316 695 7512 en formato E.164.
Scroll suave entre secciones y enlace activo en navbar.
Menú móvil (abre/cierra en pantallas pequeñas).
Asignación automática del enlace de WhatsApp a todos los CTAs (Solicitar cotización, Agendar, botón flotante, etc.).
Inicialización de AOS y lightbox de la galería.
▶️ Cómo ejecutar el proyecto
Clona o copia la carpeta FH_salon_social en tu máquina.
Opción rápida (recomendada):
   cd FH_salon_social   python -m http.server 5173
Luego abre en el navegador: http://localhost:5173
> También puedes abrir directamente index.html con doble clic, pero algunas cosas funcionan mejor con localhost.
✅ Personalización rápida
Número de WhatsApp: se configura en script.js dentro del objeto CONFIG.
Logo: archivo logo.jpg en la raíz, referenciado en el header.
Icono de WhatsApp: archivo whatsapp.jpg en la raíz.
Fotos reales del salón: reemplaza las URLs de la galería en index.html por tus propias imágenes (también pueden ser URLs externas).
Reseñas: puedes añadir nuevas tarjetas en la sección de testimonios y/o actualizar el iframe de Google Maps con el código de “Insertar un mapa” desde tu ficha.
