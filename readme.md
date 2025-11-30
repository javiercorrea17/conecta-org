# Conecta ONG - Plataforma de Gestión de Impacto Social

**Conecta ONG** es una aplicación web diseñada para centralizar y optimizar la gestión de eventos y voluntarios en organizaciones sin fines de lucro. Este proyecto busca solucionar la fragmentación de datos y la carga administrativa manual que sufren muchas fundaciones.

## 📋 Características Principales

Esta versión (MVP) incluye las funcionalidades esenciales para la operación diaria:

* **Dashboard Interactivo:** Vista general con métricas clave (KPIs) como eventos activos, total de voluntarios y horas de impacto.
* **Gestión de Eventos:**
    * Creación de nuevos eventos con metas de recaudación y voluntarios.
    * Visualización de eventos con tarjetas informativas y barras de progreso.
    * Listado de participantes inscritos por evento.
* **Base de Datos de Voluntarios:**
    * Registro de nuevos voluntarios con habilidades específicas.
    * Visualización del historial de eventos de cada voluntario.
* **Sistema de Inscripción Inteligente:**
    * Permite inscribir voluntarios existentes rápidamente o registrar nuevos durante el proceso de inscripción a un evento.
* **Persistencia de Datos:** Utiliza `LocalStorage` para mantener la información guardada en el navegador sin necesidad de una base de datos externa por el momento.

## 🛠️ Tecnologías Utilizadas

El proyecto fue construido siguiendo una arquitectura limpia y sin dependencias pesadas (Vanilla JS):

* **HTML5:** Estructura semántica.
* **CSS3:** Diseño moderno con variables, Flexbox, CSS Grid y efectos de "Glassmorphism".
* **JavaScript (ES6+):** Lógica de negocio, manipulación del DOM y persistencia de estado.
* **FontAwesome:** Iconografía.
* **Google Fonts:** Tipografía (Familia 'Outfit').

## 🚀 Instalación y Uso

Este proyecto es una aplicación estática, por lo que no requiere instalación de servidores ni bases de datos complejas.

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/javiercorrea17/conecta-org.git](https://github.com/javiercorrea17/conecta-org.git)
    ```
2.  **Abrir el proyecto:**
    Navega a la carpeta del proyecto y abre el archivo `index.html` en tu navegador web favorito (Chrome, Edge, Firefox).

**Nota:** Para simular la experiencia completa, se recomienda usar un servidor local (como Live Server en VS Code), aunque funciona abriendo el archivo directamente.

## 👤 Autor

**Javier Stiven Correa Sua**
* Facultad de Ingeniería, Universidad Iberoamericana
* Curso: Desarrollo de Aplicaciones Web
* Fecha: Noviembre 2025

---
*Proyecto desarrollado como propuesta para la Actividad 2.*
