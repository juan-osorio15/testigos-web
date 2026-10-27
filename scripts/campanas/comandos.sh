# Comandos de campañas, para copiar y pegar.
# Se corren desde la carpeta testigos-web. Explicación completa en docs/campanas/README.md.
# Este archivo no se ejecuta: es una lista. Sin --enviar ningún comando envía nada.
echo "Copia el comando que necesites; este archivo no se corre entero." && exit 1


# ── Antes de todo ───────────────────────────────────────────────
# Si un comando pide actualizar los datos del evento (precios, fechas):
npm run build


# ── Listas para respond.io (WhatsApp) ───────────────────────────
# Quedan en ~/Downloads, con la etiqueta de la campaña y la fecha (expirados-25102026).
python3 scripts/campanas/campana.py respondio expirados
python3 scripts/campanas/campana.py respondio interesados
# Compradores (pedido pagado) como Customer, para que no les lleguen los broadcasts de RC.
# Correrlo e importarlo en respond.io justo antes de cada broadcast.
python3 scripts/campanas/campana.py respondio compradores


# ── Contar gente, sin enviar nada ───────────────────────────────
python3 scripts/campanas/campana.py lista expirados
python3 scripts/campanas/campana.py lista expirados --dias 7
python3 scripts/campanas/campana.py lista interesados
python3 scripts/campanas/campana.py lista interesados --dias 7
python3 scripts/campanas/campana.py lista agenda-fernando


# ── Correo a expirados ──────────────────────────────────────────
python3 scripts/campanas/campana.py correo expirados                                       # vista previa
python3 scripts/campanas/campana.py correo expirados --prueba j.a.oso15@gmail.com --enviar  # prueba
python3 scripts/campanas/campana.py correo expirados --enviar                              # envío real


# ── Correo a interesados del sitio ──────────────────────────────
python3 scripts/campanas/campana.py correo interesados
python3 scripts/campanas/campana.py correo interesados --prueba j.a.oso15@gmail.com --enviar
python3 scripts/campanas/campana.py correo interesados --enviar


# ── Carta de Fernando (desde el 27 de octubre), por tandas ─────
# Después de los correos de cierre-descuento del día; 100 al día entre todo. Plan en docs/campanas/lista-fernando/correo/README.md.
python3 scripts/campanas/campana.py correo carta-fernando --maximo 80
python3 scripts/campanas/campana.py correo carta-fernando --prueba j.a.oso15@gmail.com --enviar
python3 scripts/campanas/campana.py correo carta-fernando --maximo 80 --enviar


# ── Cierre de la etapa 2 (27 al 29 de octubre) ──────────────────
# Un número por día: 1 el martes, 2 el miércoles, 3 el jueves. Plan en docs/campanas/cierre-descuento/README.md.
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados --prueba j.a.oso15@gmail.com --enviar
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados --enviar
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados --prueba j.a.oso15@gmail.com --enviar
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados --enviar


# ── Correo de Fernando a su agenda ──────────────────────────────
# 100 por día en el plan gratis de Resend: se repite el mismo comando cada día y sigue con los que faltan.
python3 scripts/campanas/campana.py correo agenda-fernando
python3 scripts/campanas/campana.py correo agenda-fernando --prueba j.a.oso15@gmail.com --enviar
python3 scripts/campanas/campana.py correo agenda-fernando --enviar


# ── WhatsApp directo por la API de Meta (sin respond.io) ────────
python3 scripts/campanas/campana.py whatsapp expirados                              # vista previa
python3 scripts/campanas/campana.py whatsapp expirados --prueba 57XXXXXXXXXX --enviar  # prueba
python3 scripts/campanas/campana.py whatsapp interesados
python3 scripts/campanas/campana.py whatsapp interesados --prueba 57XXXXXXXXXX --enviar


# ── Cuántos mensajes salieron ───────────────────────────────────
python3 scripts/campanas/campana.py registro
python3 scripts/campanas/campana.py registro expirados


# ── Opciones que se le pueden sumar a cualquiera ────────────────
# --dias 7                        solo los de los últimos 7 días
# --excluir correo-o-telefono     deja a alguien por fuera (se puede repetir)
# --lista ARCHIVO.csv             usa una lista ya guardada en vez de armarla
# --salida RUTA.csv               respondio: guarda el archivo en otra parte
#
# Horario de envío (Ley 2300): lunes a viernes de 7 a.m. a 7 p.m., sábado de 8 a.m. a 3 p.m.,
# domingos y festivos no. Fuera de ese horario el comando se niega a enviar.
