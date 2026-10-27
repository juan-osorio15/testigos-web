# respond.io · Broadcasts

respond.io es la plataforma donde vive Catalina, el agente del número colombiano (+57 323 923 6021) y de Instagram. Desde ahí también se mandan **broadcasts**: un mismo mensaje a un grupo de contactos que ya están en respond.io, filtrados por su Lifecycle, sus etiquetas o sus campos.

Lo que va en esta carpeta son esos broadcasts. Las campañas por la API (IN y EX, con `campana.py`) siguen en sus carpetas; las de grupos y la lista de Fernando se publican a mano.

## Cómo funciona un broadcast

- A quien no nos ha escrito en las últimas 24 horas solo se le puede escribir con una **plantilla aprobada por Meta**. Se crean en WhatsApp Manager, en la cuenta del número colombiano, categoría Marketing, idioma español. respond.io las trae solas cuando Meta las aprueba. Una plantilla aprobada no se puede editar: si un dato cambia, se crea otra.
- La variable `{{1}}` es el nombre del contacto. En respond.io se llena con el campo First Name; Meta pide un ejemplo al crearla (por ejemplo, "Ana").
- Si la persona responde, la conversación se abre otra vez y la toma Catalina. El prompt ya sabe que quien responde a un mensaje de recuperación va con `utm_campaign=recuperacion` en sus enlaces.

## Reglas

Las mismas de toda la campaña de WhatsApp (`../README.md`, "Reglas para todos los textos" y "Cómo se escribe cada mensaje"), y además:

- **Horario de la Ley 2300:** lunes a viernes de 7:00 a.m. a 7:00 p.m. y sábados de 8:00 a.m. a 3:00 p.m.; nunca domingos ni festivos (el lunes 2 de noviembre es festivo). respond.io no lo controla: se programa a mano dentro del horario.
- Cada plantilla identifica a Eventalist S.A.S. y lleva el pie "Para no recibir más mensajes, responde BAJA."
- Quien pidió no recibir más mensajes no entra en ningún broadcast.
- Los enlaces siguen la guía (`docs/medicion/embudo/enlaces-y-nombres.md`), con `utm_campaign=recuperacion`, igual que los que da Catalina a quien responde.

## Broadcasts

- [`inactivos/`](inactivos/) · **RC** · conversaciones que se cerraron por inactividad sin compra. Una plantilla por día hasta el evento.
- [`../../cierre-descuento/`](../../cierre-descuento/) · **CD** · los tres últimos días de la etapa 2 (27 al 29 de octubre), a todos los contactos sin compra. Va junto con tres correos.
