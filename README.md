# Focus Up Website

Sitio web institucional para **Focus Up**, diseñado para presentar la propuesta de valor, servicios y formulario de contacto de manera clara y moderna.

## Tecnologías

- HTML5, CSS3 y JavaScript
- Animaciones y transiciones CSS
- Formulario de contacto con envío por PHP (configurable según hosting)

## Funcionalidades principales

- Secciones con scroll guiado y animaciones suaves
- Slider de contenido con navegación mediante rueda del mouse
- Formulario de contacto con validación en el navegador
- Preparado para integración de envío de emails vía `contact.php`

## Estructura del proyecto

- `index.html`: Página principal del sitio  
- `assets/css/`: Estilos globales y componentes  
- `assets/js/`: Lógica de interacción (scroll, sliders, modales, formulario)  
- `contact.php`: Endpoint para el envío del formulario de contacto (requiere hosting con PHP)

## Cómo ver el sitio

1. Clonar el repositorio:
git clone https://github.com/TU-USUARIO/TU-REPO.git

2. Abrir `index.html` en el navegador  
- O servir el proyecto con cualquier servidor estático (por ejemplo, con la extensión Live Server de VS Code).

## Configuración del formulario de contacto

1. Abrir `contact.php`.  
2. Editar la variable:

$to = 'info@su-dominio.com';

3. Subir el archivo junto con el sitio al hosting que tenga soporte para PHP y correo.

## Deploy / Link para el cliente

Una vez publicado el sitio (GitHub Pages, hosting propio, etc.), se puede compartir directamente este enlace con el cliente:

- **Repositorio:** `https://github.com/TU-USUARIO/TU-REPO`  
- **Sitio en producción:** `https://TU-DOMINIO.com` o `https://tu-usuario.github.io/tu-repo` (según el caso)
