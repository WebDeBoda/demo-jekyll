---
layout: custom
title: Boda de María y José

hero-section:
    title: ¡Ven y celebra con nosotros dos!
    subtitle: Estamos muy contentos de que estés aquí para poder contarte todos los detalles de nuestra boda.
    main-button:
        href: /paginas/formulario-registro.html
        text: Confirmar asistencia
    secondary-button:
        href: \#lista-hoteles
        text: Ver hoteles cercanos

mapa:
    title: Lugar de celebración
    description: La ceremonia se celebrará en la <b>Parroquia Santa María de Caná</b> de Pozuelo de Alarcón y el posterior banquete tendrá lugar en <b>Finca Las Jarillas</b> en Madrid.
    locations:
        - src: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d878.184098662612!2d-3.7998433738211235!3d40.43457430474152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4186415716a5a1%3A0xba88876cc831beec!2sParroquia%20Santa%20Mar%C3%ADa%20de%20Can%C3%A1!5e1!3m2!1ses!2ses!4v1746205699524!5m2!1ses!2ses
        - src: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117182.18917262406!2d-3.8608358811636907!3d40.573086900000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422ad3a2de4be9%3A0x3bb426869bee2921!2sFinca%20Las%20Jarillas!5e1!3m2!1ses!2ses!4v1746205941306!5m2!1ses!2ses

time-left:
    background-image: /galeria/cuenta_atras.jpg
    wedding-date: "2026-05-11T13:00:00"

dia-boda:
    title: Día de la boda
    description: Estamos encantados de compartir contigo los detalles de nuestro día especial. A continuación, encontrarás el horario de la celebración y los momentos que hemos preparado con tanto cariño para disfrutar juntos.
    events:
        - title: Ceremonia
          text: "La misa dará comienzo a las 13:30 en la Parroquia de Santa María de Caná en Pozuelo de Alarcón."
          image: /galeria/dia-boda/iglesia.jpg
        - title: Buses a la finca
          text: "Al terminar la misa, habrá una flota de autobuses esperando para llevaros a todos a la finca."
          image: /galeria/dia-boda/autobus.jpg
        - title: Aperitivo en jardines
          text: "Comenzaremos la celebración disfrutando de un aperitivo en los jardines de la finca."
          image: /galeria/dia-boda/aperitivo.jpg
        - title: Banquete
          text: "Tras el aperitivo nos dirigiremos a la zona de banquete para disfrutar de la comida."
          image: /galeria/dia-boda/banquete.jpg
        - title: Fiesta
          text: "Esperamos que hayas cogido energía en la comida porque te queremos dándolo todo en la pista de baile."
          image: /galeria/dia-boda/fiesta-2.jpg

hoteles:
    title: Hoteles y apartamentos
    description: Para facilitar la búsqueda de alojamiento, te compartimos una selección de hoteles que quedan cerca de los puntos de recogida de los autobuses. Además, en algunos de ellos hemos conseguido un descuento específico para el fin de semana de la boda.

regalos:
    title: Participa en nuestra historia
    description: Esta sección es nuestra lista de bodas. Si quieres te la puedes saltar, porque para nosotros lo más importante es contar con tu presencia. Si de todas formas quieres hacernos un regalo para que empecemos nuestra aventura juntos, te dejamos algunas sugerencias.
    aclaracion: ¡Contribuye al regalo que quieras!
    IBAN: ES00 1111 2222 3333 4444 5555
    codigo_bic: AABBCCD2
---

{% include hero-section.html %}
{% include mapa.html %}
{% include time-left.html %}
{% include dia-boda.html %}
{% include hoteles.html %}
{% include regalos.html %}
