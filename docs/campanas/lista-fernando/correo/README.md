# Lista de Fernando · correo

La invitación de Fernando Cordovez a sus contactos personales, por correo, firmada por él y desde `direccion@testigosdelamemoria.com`. Va con la misma campaña de medición que su WhatsApp (`utm_campaign=lista-fernando`, `utm_medium=aliados`, `utm_content=correo-invitacion`).

- Configuración: `scripts/campanas/config/agenda-fernando.json`. Plantilla: `scripts/campanas/plantillas/agenda-fernando.html`. Asunto: "Te invito a Testigos de la Memoria, en Villa de Leyva".
- Audiencia `agenda` (`scripts/campanas/audiencias/agenda.py`): los CSV de Google Contacts que él comparta, en `~/Documents/eventalist/datos/testigos-memoria/agenda-fernando/`. No entran al backend ni a ninguna otra campaña, y la carpeta se borra al terminar el evento.
- Solo correo: a estos contactos nunca se les escribe por WhatsApp desde el número del encuentro. Fuera quien ya compró, tiene un pedido pendiente o se dio de baja del correo en el backend.

## Comandos

```sh
python3 scripts/campanas/campana.py lista agenda-fernando
python3 scripts/campanas/campana.py correo agenda-fernando                                          # vista previa
python3 scripts/campanas/campana.py correo agenda-fernando --prueba manager@eventalist.co --enviar   # prueba
python3 scripts/campanas/campana.py correo agenda-fernando --enviar                                  # envío real
```

Resend manda 100 correos al día entre todas las campañas. Si la agenda pasa de eso, se repite el mismo comando cada día y sigue con los que faltan. Los días de `cierre-descuento`, primero el cierre.
