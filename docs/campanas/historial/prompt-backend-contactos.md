# Prompt · lectura de contactos de una campaña (repo `eventalist-backend`)

> **Implementado y en producción desde el 2026-10-19.** El contrato vigente está en `docs/campanas/README.md`; este prompt queda como historia.
>
> Copiar este documento completo como instrucción al agente que trabaja en `eventalist-backend`. Es autocontenido. Fecha: 2026-10-19. Si algo aquí contradice el código de `apps/marketing`, avisar antes de desviarse. Sigue el flujo de specs del repo (`specs/017-...`).

## Contexto

`apps/marketing` guarda los contactos que llegan por el formulario "avísame" de los sitios de evento (`POST /api/v1/marketing/contacts/submit/`, feature 014) y por los pedidos de Pretix (feature 016), con su autorización por canal, sus bajas y su etapa de compra por campaña (`CampaignMembership.stage`). Hoy solo se leen desde el admin, exportando un CSV.

El equipo manda campañas de correo y WhatsApp con scripts locales (repo del sitio testigosdelamemoria.com, `scripts/backend/interesados_sin_compra.py`). El primero es un aviso a quien pidió que le avisáramos de la venta de las franjas. Hoy el titular entra al admin, filtra, exporta, mueve el archivo y lo borra. Se pide un endpoint de **solo lectura** para que el script tome la lista directo, sin archivos de por medio.

## Endpoint

`GET /api/v1/marketing/campaigns/<slug>/contacts/`

- **Autenticación de servicio**, igual que la de Pretix (`apps/marketing/api/authentication.py`) pero con su propia lista de tokens: `Authorization: Bearer <token>`, tokens en `MARKETING_READ_TOKENS` (varios separados por comas, para rotar), comparación con `hmac.compare_digest`. Sin token válido: `401`. Un token de Pretix no sirve aquí ni al revés.
- Solo `GET`. Ninguna escritura, ni siquiera `last_contacted_at`.
- Campaña inexistente: `404`.
- Filtros opcionales por query string: `source` (por ejemplo `website`) y `stage` (`interested`, `order_pending`, `order_canceled`, `purchased`). Valor fuera de las opciones: `400`.
- Paginado, 200 por página, con `count`, `next`, `previous`, `results` (la paginación estándar de DRF). Orden estable por `joined_at` y `id`.
- Documentado en drf-spectacular como los demás.

### Cada resultado

```json
{
  "first_name": "Ana",
  "email": "ana@ejemplo.co",
  "phone": "+573001234567",
  "source": "website",
  "joined_at": "2026-09-20T14:03:11-05:00",
  "stage": "interested",
  "email_reachable": true,
  "whatsapp_reachable": true
}
```

- `email` y `phone`: `null` si el contacto no los tiene. El teléfono en E.164, como se guarda.
- `joined_at`: de `CampaignMembership`, en ISO 8601 con zona horaria.
- `stage`: la etapa de la membresía en esa campaña.
- `email_reachable` y `whatsapp_reachable`: **la misma regla** que las columnas `email_consent` y `whatsapp_consent` del CSV del admin cuando se filtra por la campaña (autorización válida para la campaña, contacto activo, dato presente y sin baja de ese canal). Reutilizar los selectores, no copiar la lógica.
- Nada más: ni apellido, ni ciudad, ni notas, ni el historial de autorizaciones.

## Restricciones

- Los contactos con `status` distinto de `active` sí salen, con los dos `*_reachable` en `false`, para que el script cuente las bajas en su resumen.
- Sin throttling (lo llama un script del equipo, pocas veces al día).
- Registrar en el log cada lectura: token usado (sus últimos 4 caracteres), campaña, filtros y cuántos resultados. Nunca los datos de las personas.
- Pruebas: 401 sin token y con token de Pretix; 404 con campaña inexistente; filtros; paginación; que `*_reachable` coincida con el CSV del admin para los mismos contactos; que un contacto con baja de correo salga con `email_reachable: false`.

## Al terminar

- Agregar `MARKETING_READ_TOKENS` a `.env.example` y decir cómo generar el token (por ejemplo `python -c "import secrets; print(secrets.token_urlsafe(32))"`) y dónde ponerlo en Railway.
- Entregar al titular, fuera del repo, el token de producción. Él lo guarda en el llavero de su Mac (servicio `eventalist-backend-lectura`) y el script lo toma de ahí.
- Responder con un ejemplo real de respuesta (con datos inventados) para confirmar el contrato. El script del sitio ya está escrito contra este formato; si algo cambia, avisar para ajustarlo.
