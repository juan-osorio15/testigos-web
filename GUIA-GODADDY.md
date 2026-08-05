# Guía: publicar la página en testigosdelamemoria.com (GoDaddy)

Tienes dos caminos según lo que tengas contratado en GoDaddy. Solo el dominio
no basta para "hospedar" archivos: necesitas un hosting (de GoDaddy o gratuito
externo) y luego conectar el dominio.

Los archivos a subir son:

```
index.html
assets/logo.svg
```

(La guía `GUIA-GODADDY.md` no hace falta subirla.)

---

## Opción A — Tienes plan de Hosting Web en GoDaddy (cPanel)

1. Entra a https://account.godaddy.com y ve a **Mis productos**.
2. En la sección **Hosting web**, haz clic en **Administrar** junto a tu plan.
3. Abre el **Panel de control (cPanel)** y entra a **Administrador de archivos**
   (File Manager).
4. Navega a la carpeta **`public_html`** (es la raíz pública del sitio).
5. Sube `index.html` directamente ahí (botón **Upload / Cargar**).
6. Crea una carpeta llamada **`assets`** dentro de `public_html` y sube ahí
   `logo.svg`.
7. Si el dominio testigosdelamemoria.com está en la misma cuenta GoDaddy y
   asignado a ese hosting, ya debería verse en https://testigosdelamemoria.com
   en unos minutos. Si no está asignado: en la configuración del hosting busca
   **Dominios → Agregar dominio** y selecciona testigosdelamemoria.com.
8. Activa el certificado SSL si el plan lo incluye (cPanel → SSL/TLS), para que
   funcione con `https://`.

---

## Opción B — Solo tienes el dominio (hosting gratis con GitHub Pages)

No necesitas pagar hosting para una página "próximamente". GitHub Pages es
gratuito y estable.

### 1. Subir los archivos a GitHub

1. Crea una cuenta en https://github.com si no tienes.
2. Crea un repositorio nuevo, público, llamado por ejemplo `testigos-web`.
3. En el repositorio: **Add file → Upload files** y arrastra `index.html` y la
   carpeta `assets` (con `logo.svg` dentro). Confirma con **Commit changes**.
4. Ve a **Settings → Pages**. En **Source** elige la rama `main` y carpeta
   `/ (root)`. Guarda. En un minuto tendrás el sitio en
   `https://TU-USUARIO.github.io/testigos-web/`.

### 2. Conectar el dominio en GitHub

1. En esa misma pantalla **Settings → Pages**, en **Custom domain**, escribe
   `testigosdelamemoria.com` y guarda. (GitHub creará un archivo `CNAME` en el
   repositorio; déjalo ahí.)

### 3. Configurar el DNS en la consola de GoDaddy

1. Entra a https://dcc.godaddy.com (o **Mis productos → Dominios →
   testigosdelamemoria.com → DNS / Administrar DNS**).
2. Borra los registros **A** existentes del host `@` (suelen apuntar a la
   página de "parking" de GoDaddy). No borres registros MX ni TXT si usas
   correo con este dominio.
3. Agrega estos **4 registros A**, todos con host `@` y TTL por defecto:

   | Tipo | Host | Valor            |
   |------|------|------------------|
   | A    | @    | 185.199.108.153  |
   | A    | @    | 185.199.109.153  |
   | A    | @    | 185.199.110.153  |
   | A    | @    | 185.199.111.153  |

4. Agrega (o edita si ya existe) un registro **CNAME** para `www`:

   | Tipo  | Host | Valor                     |
   |-------|------|---------------------------|
   | CNAME | www  | TU-USUARIO.github.io      |

   (Reemplaza `TU-USUARIO` por tu nombre de usuario de GitHub, sin el nombre
   del repositorio.)

5. Espera la propagación del DNS: normalmente entre 15 minutos y una hora,
   aunque puede tardar hasta 24–48 h.
6. Vuelve a **Settings → Pages** en GitHub: cuando el dominio aparezca
   verificado, marca la casilla **Enforce HTTPS** para tener el candado de
   seguridad (certificado gratuito automático).

### Verificar

- Abre https://testigosdelamemoria.com y https://www.testigosdelamemoria.com —
  ambas deben mostrar la página.
- Si ves aún la página de GoDaddy, es caché/propagación: prueba en ventana de
  incógnito o espera un poco más.

---

## Actualizar la página más adelante

- **Opción A:** reemplaza los archivos en `public_html` desde el File Manager.
- **Opción B:** sube los archivos nuevos al repositorio de GitHub (Upload files
  → Commit); el sitio se actualiza solo en ~1 minuto.

## Probar en tu computadora antes de subir

Haz doble clic en `index.html` (se abre en el navegador) y verifica que se vea
el logo centrado con "Proximamente..." debajo sobre el fondo naranja #d45b30.
