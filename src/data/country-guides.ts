import type { Locale } from '../i18n';
export type CountryGuide = {
  name: string;
  seoTitle: string;
  description: string;
  intro: string;
  sections: [string, string, string][];
  faq: [string, string][];
  sources: { title: string; url: string }[];
};
export const countryGuides: Record<string, Record<Locale, CountryGuide>> = {
  it: {
    es: {
      name: 'Italia',
      seoTitle: 'Viajar a Italia: guías de ciudades, rutas y consejos',
      description:
        'Organiza un viaje a Italia con guías de Roma, Venecia, Florencia, Milán y Costa Amalfitana, rutas de visita y consejos para elegir destinos y entradas.',
      intro:
        'Italia reúne viajes urbanos de arte e historia y estancias junto al mar que requieren ritmos diferentes. Esta guía conecta el contenido disponible para elegir una zona, preparar las visitas y combinar destinos sin convertir las vacaciones en una sucesión de traslados.',
      sections: [
        [
          'Elegir las ciudades y la región',
          'Roma, Florencia y Venecia permiten orientar el viaje hacia arqueología, pintura y barrios históricos. Milán añade colecciones y arquitectura, mientras que la Costa Amalfitana requiere pensar en pueblos, desniveles y desplazamientos costeros. Empieza por las experiencias que te interesan y comprueba en cada guía qué lugares se desarrollan.',
          'Las guías de Navidad responden una intención diferente: describen celebraciones y condiciones de una temporada concreta. Úsalas junto con las guías generales, comprobando las fechas del evento. Una fotografía de archivo no acredita una instalación temporal ni su apertura actual.',
        ],
        [
          'Organizar rutas y traslados',
          'Trabaja por zonas: agrupa las visitas del mismo barrio y deja margen entre una llegada en tren o avión y una reserva. Que dos ciudades formen parte del mismo viaje no significa que una excursión improvisada permita verlas con calma. Decide primero dónde dormir y cuántos cambios de base necesitas.',
          'En la Costa Amalfitana, el puerto y el centro de cada pueblo no siempre están al mismo nivel. Ravello está en altura y no se alcanza directamente en ferry. Consulta las rutas oficiales, su temporada y los avisos del día antes de contar con un barco o con una conexión por carretera.',
        ],
        [
          'Entradas, presupuesto y alojamiento',
          'Separa alojamiento, transporte entre ciudades, traslados locales, comidas y entradas. Los museos y complejos monumentales pueden ofrecer productos distintos: terrazas, exposiciones o visitas especiales no siempre forman parte de la entrada básica. Compara lo incluido antes de comparar únicamente el importe.',
          'Para elegir alojamiento, cruza las estaciones y visitas previstas con las condiciones del establecimiento. La cercanía aparente en el mapa no resuelve las escaleras, el equipaje o la llegada nocturna. Las guías específicas enlazadas aportan detalles; no hay un presupuesto nacional único que represente todos estos viajes.',
        ],
        [
          'Cuándo viajar y qué confirmar',
          'La decisión depende de la región y de tu actividad: visitar un museo, recorrer calles y utilizar transporte marítimo tienen necesidades diferentes. Comprueba previsión meteorológica, calendario de apertura y disponibilidad de las visitas más importantes para ti antes de fijar el recorrido.',
          'En las guías encontrarás fechas de consulta y fuentes para los datos variables. Revisa nuevamente las condiciones al reservar. Los itinerarios son propuestas para organizar visitas, sin prometer tiempos de traslado constantes ni acceso a todas las salas.',
        ],
      ],
      faq: [
        [
          '¿Por dónde empezar un primer viaje a Italia?',
          'Elige una o dos zonas según tus intereses y el tiempo real disponible. Consulta las guías de ciudad y sus recorridos antes de sumar más bases; reservar museos sin revisar los traslados puede dejar muy poco margen.',
        ],
        [
          '¿Las guías de temporada sustituyen las de ciudad?',
          'No. Una guía de Navidad desarrolla una celebración concreta y necesita sus fechas; una guía general sirve para elegir lugares y organizar la estancia. Ambas se distinguen en el listado disponible.',
        ],
        [
          '¿Dónde están los itinerarios y consejos específicos?',
          'Cada artículo enlazado incluye su propia organización de visitas y fuentes. Los enlaces de esta página llevan a contenidos publicados; las futuras guías de transporte o alojamiento se añadirán cuando estén investigadas y aprobadas.',
        ],
      ],
      sources: [
        {
          title: 'Italia.it',
          url: 'https://www.italia.it/en/italy/travel-ideas',
        },
      ],
    },
    en: {
      name: 'Italy',
      seoTitle: 'Travel to Italy: city guides, routes and practical advice',
      description:
        'Plan an Italy trip with guides to Rome, Venice, Florence, Milan and the Amalfi Coast, suggested visiting routes and advice on choosing places and tickets.',
      intro:
        'Italy brings together urban journeys through art and history and coastal stays that need a different pace. This guide connects the available articles so you can choose an area, prepare visits and combine destinations without spending the holiday constantly changing bases.',
      sections: [
        [
          'Choose cities and a region',
          'Rome, Florence and Venice suit trips focused on archaeology, painting and historic neighbourhoods. Milan adds collections and architecture, while the Amalfi Coast calls for decisions about towns, slopes and coastal transport. Start with the experiences you want and check which places each guide develops.',
          'Christmas guides answer a separate question: they describe celebrations and the conditions of a particular season. Use them alongside general city guides and check event dates. An archive photograph does not establish that a temporary installation is present or currently open.',
        ],
        [
          'Arrange routes and transfers',
          'Work by area: group visits in the same neighbourhood and allow time between a train or flight arrival and a reservation. Including two cities in one trip does not make an improvised excursion an unhurried visit. Decide where to sleep and how many changes of base you need first.',
          'On the Amalfi Coast, a town’s harbour and centre are not always at the same level. Ravello is uphill and cannot be reached directly by ferry. Check official routes, their operating season and daily notices before relying on a boat or a road connection.',
        ],
        [
          'Tickets, costs and accommodation',
          'Separate accommodation, intercity transport, local transfers, meals and admission charges. Museums and monument complexes can sell different products: terraces, exhibitions and special tours may be outside a basic ticket. Compare what is included before comparing only the price.',
          'When choosing accommodation, match stations and planned visits to the property’s conditions. Apparent closeness on a map does not settle questions about stairs, luggage or a late arrival. Linked specialist guides supply details; no single national budget represents all these journeys.',
        ],
        [
          'When to travel and what to confirm',
          'The decision depends on the region and activity: visiting a museum, walking city streets and using sea transport have different requirements. Check the forecast, opening calendar and availability of the visits that matter most before fixing the route.',
          'Guides retain consultation dates and sources for information that changes. Recheck conditions when booking. Suggested itineraries help organise visits without promising constant journey times or access to every gallery.',
        ],
      ],
      faq: [
        [
          'Where should a first Italy trip begin?',
          'Choose one or two areas that fit your interests and actual time. Read city guides and suggested routes before adding bases; booking museums without checking transfers can leave little flexibility.',
        ],
        [
          'Do seasonal guides replace city guides?',
          'No. A Christmas guide develops a particular celebration and its dates; a general guide helps you choose places and organise a stay. The available directory distinguishes them.',
        ],
        [
          'Where are the specific itineraries and practical tips?',
          'Each linked article includes its own visiting plan and sources. Links here lead to published content; future transport and accommodation guides will be added once researched and approved.',
        ],
      ],
      sources: [
        {
          title: 'Italia.it',
          url: 'https://www.italia.it/en/italy/travel-ideas',
        },
      ],
    },
  },
  jp: {
    es: {
      name: 'Japón',
      seoTitle: 'Viajar a Japón: Tokio, Kioto, Osaka, Nara y Monte Fuji',
      description:
        'Elige destinos de Japón con guías de Tokio, Kioto, Osaka, Nara y alrededores del Monte Fuji, recorridos y consejos para organizar visitas y conexiones.',
      intro:
        'Un viaje a Japón mejora cuando separas las grandes ciudades de las excursiones y eliges bien las bases. Este centro reúne las guías disponibles para organizar barrios, templos, parques y paisajes del Fuji, con contenido de temporada identificado por su intención.',
      sections: [
        [
          'Elegir bases y combinar destinos',
          'Tokio puede organizarse por barrios; Kioto necesita agrupar templos y desplazamientos, y Osaka y Nara permiten explorar facetas distintas de la región de Kansai. Compara los lugares desarrollados en cada guía para decidir dónde necesitas más tiempo. No todas las visitas se resuelven con un traslado breve.',
          'Los alrededores del Monte Fuji forman otra zona de viaje. Ver lagos y santuarios al pie de la montaña no equivale a ascender a la cumbre. La visibilidad depende del tiempo y la ruta de observación debe tener sentido aunque el monte permanezca cubierto.',
        ],
        [
          'Transporte y organización diaria',
          'Distingue el desplazamiento entre ciudades de los viajes locales. La estación que conviene para tu hotel no siempre es la mejor para cada visita, y distintos operadores pueden participar en una misma ruta. Comprueba conexiones, condiciones del billete y regreso antes de salir.',
          'Agrupa las visitas próximas y deja margen para orientarte en estaciones o cambiar de medio de transporte. No presupongas que un abono cubre todas las líneas, todos los servicios o una actividad turística. Usa los enlaces oficiales que aporta cada guía para revisar lo que vas a comprar.',
        ],
        [
          'Entradas, alojamiento y presupuesto',
          'Calcula alojamiento, viajes largos, desplazamientos locales, comidas y actividades por separado. Un recinto puede tener áreas con condiciones distintas y una entrada no implica acceso a todas las exposiciones. Para el alojamiento, compara el recorrido completo desde la estación y las condiciones de llegada.',
          'La elección cambia según el grupo: escaleras, equipaje, descansos y horarios pesan tanto como el número de lugares. Los santuarios son espacios de culto; respeta sus indicaciones y las restricciones de fotografía. Una visita interesante no requiere completar todos los puntos de una lista.',
        ],
        [
          'Estaciones y contenido de temporada',
          'Las floraciones, el follaje y las iluminaciones tienen calendarios y condiciones propios. Una foto de archivo no promete el mismo paisaje durante tu estancia. Comprueba la previsión y las condiciones locales, especialmente antes de una salida a lagos o miradores.',
          'Las guías de Halloween o Navidad se mantienen como contenidos específicos, con fechas y fuentes propias. No uses un programa de otro año para dar por confirmado el actual. Revisa los datos variables al reservar y deja alternativas para lluvia o cambios de operación.',
        ],
      ],
      faq: [
        [
          '¿Hay que visitar Tokio, Kioto y Osaka en el mismo viaje?',
          'No. Elige según tus intereses y el tiempo disponible. Más ciudades implican más cambios de base; las guías ayudan a comparar experiencias y agrupar las visitas sin intentar cubrirlo todo.',
        ],
        [
          '¿Ver el Monte Fuji exige hacer una ascensión?',
          'No. La guía de alrededores desarrolla lagos, miradores y santuarios. No es una ruta a la cumbre, ni garantiza ver la montaña despejada; consulta las condiciones locales antes de salir.',
        ],
        [
          '¿Dónde comprobar billetes y reservas?',
          'En las fuentes oficiales enlazadas dentro de cada artículo. Verifica operador, servicio, fecha y zonas incluidas; no extrapoles las condiciones de un templo, un tren o una exposición a todos los demás.',
        ],
      ],
      sources: [
        {
          title: 'Japan National Tourism Organization',
          url: 'https://www.japan.travel/en/plan/',
        },
      ],
    },
    en: {
      name: 'Japan',
      seoTitle: 'Travel to Japan: Tokyo, Kyoto, Osaka, Nara and Mount Fuji',
      description:
        'Choose Japan destinations with guides to Tokyo, Kyoto, Osaka, Nara and the Mount Fuji area, visiting routes and practical advice for arranging connections.',
      intro:
        'A Japan trip works better when you distinguish city stays from excursions and choose your bases carefully. This hub gathers the available guides for neighbourhoods, temples, parks and Fuji-area scenery, with seasonal content identified by its separate purpose.',
      sections: [
        [
          'Choose bases and combine destinations',
          'Tokyo can be approached by neighbourhood; Kyoto calls for grouping temples and journeys, while Osaka and Nara reveal different sides of Kansai. Compare the places developed in each guide to decide where you need longer. Not every visit involves a short transfer.',
          'The Mount Fuji surroundings form another travel area. Visiting lakes and shrines at the foot of the mountain is different from climbing to its summit. Visibility depends on the weather, and a sightseeing route should still make sense when the mountain is hidden.',
        ],
        [
          'Transport and daily organisation',
          'Distinguish travel between cities from local journeys. The station most convenient for your hotel may not suit every attraction, and a route can involve different operators. Check connections, ticket conditions and the return journey before setting out.',
          'Group nearby visits and allow time to find your way through stations or change transport. Do not assume one pass covers every line, service or visitor activity. Follow the official links in each guide to check what you intend to buy.',
        ],
        [
          'Tickets, accommodation and costs',
          'Work out accommodation, long-distance journeys, local transport, meals and activities separately. Different areas of a complex may have different admission conditions, and one ticket need not cover every exhibition. For accommodation, compare the whole route from the station and arrival arrangements.',
          'Your group’s needs matter: steps, luggage, breaks and opening times can outweigh the number of stops. Shrines are places of worship; follow instructions and photography restrictions. A worthwhile visit does not require completing every item on a list.',
        ],
        [
          'Seasons and seasonal guides',
          'Blossom, autumn leaves and illuminations follow their own calendars and conditions. An archive photograph does not promise the same scenery during your stay. Check the forecast and local conditions, particularly before travelling to lakes or viewpoints.',
          'Halloween and Christmas guides remain separate, date-specific articles with their own sources. Do not treat another year’s programme as confirmation of the current one. Recheck changing information when booking and leave alternatives for rain or operating changes.',
        ],
      ],
      faq: [
        [
          'Must Tokyo, Kyoto and Osaka be in the same trip?',
          'No. Choose according to your interests and available time. More cities mean more changes of base; the guides help compare experiences and group visits without trying to cover everything.',
        ],
        [
          'Do you have to climb Mount Fuji to see it?',
          'No. The surroundings guide develops lakes, viewpoints and shrines. It is not a summit route and cannot guarantee a clear view; check local conditions before setting out.',
        ],
        [
          'Where should tickets and reservations be checked?',
          'Use the official sources linked within each article. Confirm operator, service, date and included areas; do not apply one temple’s, train’s or exhibition’s conditions to all others.',
        ],
      ],
      sources: [
        {
          title: 'Japan National Tourism Organization',
          url: 'https://www.japan.travel/en/plan/',
        },
      ],
    },
  },
  mx: {
    es: {
      name: 'México',
      seoTitle: 'Viajar a México: ciudades, Caribe y guías culturales',
      description:
        'Explora las guías disponibles de México: Ciudad de México, Cancún y rutas culturales de Día de Muertos, con consejos para elegir zonas y organizar visitas.',
      intro:
        'México reúne viajes urbanos, patrimonio cultural y estancias caribeñas que no conviene tratar como una única ruta corta. Esta página conecta las guías publicadas y distingue las visitas generales de los contenidos vinculados a una celebración concreta.',
      sections: [
        [
          'Elegir una zona del país',
          'Ciudad de México propone una estancia urbana con museos y barrios, mientras que Cancún permite combinar costa y patrimonio maya. Las distancias entre regiones requieren planificar desplazamientos; no interpretes un listado nacional como una sucesión de excursiones desde el mismo hotel.',
          'Las guías de Oaxaca, Mérida, Puebla y Mixquic disponibles aquí se centran en Día de Muertos. Desarrollan una intención cultural y de temporada: revisa sus fechas y condiciones, en lugar de tratarlas como programas permanentes o como una cobertura completa de cada destino.',
        ],
        [
          'Organizar visitas y desplazamientos',
          'Empieza por una base que encaje con las visitas elegidas y comprueba los trayectos completos, incluidos los últimos tramos desde estaciones, paradas o embarcaderos. El nombre comercial de un destino puede abarcar zonas alejadas entre sí. Confirma municipio, entrada y punto de salida de cada actividad.',
          'Los recintos arqueológicos y museos tienen condiciones propias. Consulta el sitio concreto y la última admisión, no solo la hora de cierre. En el Caribe, la previsión, las banderas de playa y los avisos de los operadores pesan más que una fotografía o un programa de excursión antiguo.',
        ],
        [
          'Presupuesto y alojamiento',
          'Separa alojamiento, transporte, comidas, entradas y actividades guiadas. Revisa a quién se aplica una tarifa o una exención: nacionalidad, residencia o documentación pueden cambiar las condiciones. Una gratuidad mencionada para residentes no se extiende automáticamente a todos los turistas.',
          'Para elegir zona de alojamiento, contrasta las visitas previstas y los traslados con lo que incluye el establecimiento. Un paquete no demuestra acceso a todas las actividades de la región. Las guías publicadas aportan decisiones concretas sin inventar un coste diario universal.',
        ],
        [
          'Temporada, patrimonio y respeto',
          'Una celebración necesita fechas verificadas y respeto por sus espacios y participantes. No presentes actos familiares o comunitarios como espectáculos abiertos sin confirmación. En los sitios patrimoniales, respeta las indicaciones sobre acceso, conservación y fotografía.',
          'Las condiciones del mar, la presencia de sargazo y la operación de actividades pueden variar. Comprueba avisos cercanos a la fecha del viaje, deja alternativas culturales y no interpretes una certificación de playa como garantía de baño en cualquier momento.',
        ],
      ],
      faq: [
        [
          '¿Las guías culturales sirven durante todo el año?',
          'Los contextos históricos pueden resultar útiles, pero los programas de Día de Muertos están ligados a fechas concretas. Revisa el alcance de cada artículo y confirma el calendario actual antes de organizar la visita.',
        ],
        [
          '¿Cancún y Ciudad de México se visitan desde la misma base?',
          'Son destinos de regiones distintas. Un viaje que incluya ambos necesita planificar el desplazamiento y las estancias; los enlaces relacionados permiten comparar experiencias, sin presentar la conexión como una excursión breve.',
        ],
        [
          '¿Se publican precios y horarios sin comprobar?',
          'No. Los datos variables necesitan respaldo y fecha de consulta. Verifica la fuente oficial al reservar, especialmente tarifas, exenciones y últimas admisiones; cuando un dato no está confirmado, no se presenta como una certeza.',
        ],
      ],
      sources: [
        {
          title: 'Instituto Nacional de Antropología e Historia',
          url: 'https://lugares.inah.gob.mx/',
        },
        {
          title: 'Caribe Mexicano',
          url: 'https://mexicancaribbean.travel/destinations/cancun',
        },
      ],
    },
    en: {
      name: 'Mexico',
      seoTitle: 'Travel to Mexico: cities, the Caribbean and cultural guides',
      description:
        'Explore available Mexico guides: Mexico City, Cancún and Day of the Dead cultural routes, with practical advice on choosing areas and organising visits.',
      intro:
        'Mexico combines city journeys, cultural heritage and Caribbean stays that should not be treated as one short route. This page connects published guides and distinguishes general sightseeing from articles linked to a particular celebration.',
      sections: [
        [
          'Choose an area of the country',
          'Mexico City suits an urban stay with museums and neighbourhoods, while Cancún offers coast and Maya heritage. Distances between regions require travel planning; do not read a national list as a series of excursions from the same hotel.',
          'The Oaxaca, Mérida, Puebla and Mixquic guides available here focus on Day of the Dead. They answer a cultural, seasonal question: check their dates and conditions rather than treating them as permanent programmes or complete coverage of each destination.',
        ],
        [
          'Arrange visits and local journeys',
          'Begin with a base that fits your chosen visits and check complete journeys, including the last stretch from stations, stops or piers. A destination’s tourism name can cover places far apart. Confirm the municipality, entrance and departure point for each activity.',
          'Archaeological sites and museums have their own conditions. Check the particular venue and final admission, rather than only closing time. In the Caribbean, forecasts, beach flags and operator notices matter more than a photograph or an old excursion programme.',
        ],
        [
          'Costs and accommodation',
          'Separate accommodation, transport, meals, admission charges and guided activities. Check who qualifies for a tariff or exemption: nationality, residence and documents can change the conditions. Free admission described for residents does not automatically include every tourist.',
          'Choose accommodation by comparing planned visits and transfers with the property’s inclusions. One package does not establish access to every activity in the region. Published guides explain specific decisions without inventing a universal daily cost.',
        ],
        [
          'Seasons, heritage and respect',
          'A celebration requires verified dates and respect for its spaces and participants. Do not assume family or community events are open visitor shows. At heritage sites, follow access, conservation and photography instructions.',
          'Sea conditions, sargassum and activity operations can change. Check notices close to your travel dates, keep cultural alternatives and do not treat a beach certification as a guarantee of swimming conditions at every moment.',
        ],
      ],
      faq: [
        [
          'Are the cultural guides useful throughout the year?',
          'Historical context can remain useful, but Day of the Dead programmes concern particular dates. Check each article’s scope and confirm the current calendar before planning a visit.',
        ],
        [
          'Can Cancún and Mexico City be visited from the same base?',
          'They are destinations in different regions. A trip including both needs travel and accommodation planning; related links help compare experiences without presenting the connection as a short excursion.',
        ],
        [
          'Are unverified prices and hours published?',
          'No. Changing information needs supporting evidence and a consultation date. Recheck official sources when booking, especially tariffs, exemptions and final admissions; an unconfirmed detail is not presented as certainty.',
        ],
      ],
      sources: [
        {
          title: 'Instituto Nacional de Antropología e Historia',
          url: 'https://lugares.inah.gob.mx/',
        },
        {
          title: 'Caribe Mexicano',
          url: 'https://mexicancaribbean.travel/destinations/cancun',
        },
      ],
    },
  },
  us: {
    es: {
      name: 'Estados Unidos',
      seoTitle: 'Viajar a Estados Unidos: ciudades, rutas y consejos prácticos',
      description:
        'Elige tu viaje a Estados Unidos con guías de Miami, Nueva York, Orlando, Las Vegas y otros destinos, recorridos y consejos para organizar reservas y traslados.',
      intro:
        'Estados Unidos ofrece viajes muy distintos según la región y el tipo de estancia. Usa estas guías para elegir ciudades y experiencias, distinguiendo parques temáticos, paseos urbanos, espacios naturales y celebraciones de temporada.',
      sections: [
        [
          'Elegir ciudades sin subestimar distancias',
          'Miami, Nueva York, Orlando y Las Vegas responden a intereses y geografías diferentes. Decide primero qué experiencias buscas y el tiempo disponible para desplazarte. Un conjunto de enlaces del mismo país no equivale a un itinerario viable con cambios diarios de ciudad.',
          'La cobertura también incluye otros destinos y guías de temporada. Los artículos de Navidad y Halloween están identificados como tales; sus eventos no se consideran permanentes. Consulta la guía concreta y su fecha antes de reservar una actividad ligada al calendario.',
        ],
        [
          'Transporte, bases y alojamiento',
          'Compara el trayecto entre aeropuerto, alojamiento y visitas antes de elegir una zona. Un hotel económico puede requerir más traslados, y disponer de coche añade decisiones sobre aparcamiento y condiciones del alquiler. No todos los destinos se organizan del mismo modo.',
          'En Orlando, un distrito de restaurantes o entretenimiento no es lo mismo que un parque temático. Distingue entrar al recinto, pagar estacionamiento y comprar una atracción individual. Los horarios y servicios de transporte pueden variar por fecha y por operador.',
        ],
        [
          'Presupuesto, reservas y documentación',
          'Separa vuelos, alojamiento, transporte local, estacionamiento, comidas y entradas. Revisa impuestos, condiciones de cancelación y lo que incluye cada reserva antes de comparar importes. No hay un presupuesto nacional único que describa un viaje urbano, una estancia en parques y una visita a islas.',
          'Consulta los requisitos de entrada en las fuentes oficiales según tu pasaporte y circunstancias antes de comprar servicios no reembolsables. Las guías de lugares no sustituyen esa comprobación. Para las atracciones, utiliza los canales oficiales y confirma fecha, producto y posibles restricciones.',
        ],
        [
          'Estaciones y actividades concretas',
          'El momento adecuado depende de la región y de lo que quieras hacer. Revisa previsiones y avisos locales, y conserva alternativas interiores para actividades al aire libre. Una imagen de archivo no promete un paisaje ni un espectáculo durante tu visita.',
          'Las listas desarrollan lugares concretos; no obligan a visitarlos todos. Usa los recorridos como propuestas y deja tiempo para desplazamientos y descansos. Las condiciones operativas se contrastan en las fuentes de cada guía, sin prometer tiempos de espera o disponibilidad constante.',
        ],
      ],
      faq: [
        [
          '¿Conviene combinar muchas ciudades en un primer viaje?',
          'Solo si el tiempo y los desplazamientos tienen sentido para tu ruta. Compara las experiencias y bases antes de reservar vuelos internos o entradas; un listado de destinos no es un itinerario obligatorio.',
        ],
        [
          '¿Orlando exige visitar parques temáticos?',
          'No. La guía enlazada reúne opciones fuera de los parques temáticos, con espacios urbanos, jardines, cultura y entretenimiento. Algunas actividades individuales siguen siendo de pago y el estacionamiento puede tener condiciones propias.',
        ],
        [
          '¿Las páginas de temporada permanecen disponibles?',
          'Sí. Conservan sus URLs, textos y fechas. Revisa el año y la información vigente de cada celebración; su presencia en el catálogo no garantiza que un evento antiguo siga abierto.',
        ],
      ],
      sources: [
        {
          title: 'U.S. Department of State',
          url: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html',
        },
        {
          title: 'Visit Orlando',
          url: 'https://www.visitorlando.com/things-to-do/beyond-theme-parks/',
        },
      ],
    },
    en: {
      name: 'United States',
      seoTitle:
        'Travel to the United States: cities, routes and practical tips',
      description:
        'Choose a US trip with guides to Miami, New York, Orlando, Las Vegas and other destinations, suggested routes and advice on arranging reservations and transfers.',
      intro:
        'Travel in the United States varies greatly by region and type of stay. Use these guides to choose cities and experiences, distinguishing theme parks, urban walks, natural settings and seasonal celebrations.',
      sections: [
        [
          'Choose cities without underestimating distances',
          'Miami, New York, Orlando and Las Vegas answer different interests and involve different geography. Decide which experiences matter and how much time is available for travel first. A collection of links in the same country is not a practical itinerary with a new city every day.',
          'Coverage also includes other destinations and seasonal guides. Christmas and Halloween articles are identified separately; their events are not treated as permanent. Check the particular guide and date before booking an activity tied to a calendar.',
        ],
        [
          'Transport, bases and accommodation',
          'Compare the journey between airport, accommodation and visits before choosing an area. A cheaper hotel can mean more transfers, and a car adds parking and rental-condition decisions. Not every destination works the same way.',
          'In Orlando, a dining or entertainment district is different from a theme park. Distinguish entering a district, paying for parking and buying an individual attraction. Opening times and transport services can vary by date and operator.',
        ],
        [
          'Costs, reservations and documents',
          'Separate flights, accommodation, local travel, parking, meals and admission charges. Check taxes, cancellation rules and inclusions before comparing prices. No single national budget describes a city trip, a theme-park stay and an island visit.',
          'Check official entry requirements for your passport and circumstances before buying non-refundable services. Sightseeing guides do not replace that check. Use official attraction channels and confirm date, product and possible restrictions.',
        ],
        [
          'Seasons and specific activities',
          'The appropriate travel period depends on region and activity. Check forecasts and local notices and keep indoor alternatives for outdoor plans. An archive image does not promise a landscape or show during your stay.',
          'Lists develop particular places without requiring you to visit them all. Treat routes as suggestions and allow time for travel and breaks. Operating conditions are checked through each guide’s sources, without promising waiting times or constant availability.',
        ],
      ],
      faq: [
        [
          'Should a first trip combine many cities?',
          'Only when the time and travel requirements work for your route. Compare experiences and bases before booking domestic flights or attraction tickets; a destination list is not an obligatory itinerary.',
        ],
        [
          'Does visiting Orlando require theme parks?',
          'No. The linked guide develops options outside theme parks, including urban spaces, gardens, culture and entertainment. Individual activities can still carry charges, and parking has its own conditions.',
        ],
        [
          'Do seasonal pages remain available?',
          'Yes. Their URLs, texts and dates remain. Check the year and current information for a celebration; being in the catalogue does not establish that an older event is still open.',
        ],
      ],
      sources: [
        {
          title: 'U.S. Department of State',
          url: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html',
        },
        {
          title: 'Visit Orlando',
          url: 'https://www.visitorlando.com/things-to-do/beyond-theme-parks/',
        },
      ],
    },
  },
};
export const countryCityClusters: Record<
  string,
  { id: string; name: Record<Locale, string>; destinationIds: string[] }[]
> = {
  it: [
    {
      id: 'rome',
      name: {
        es: 'Roma',
        en: 'Rome',
      },
      destinationIds: ['rome', 'christmas-rome'],
    },
    {
      id: 'venice',
      name: {
        es: 'Venecia',
        en: 'Venice',
      },
      destinationIds: ['venice'],
    },
    {
      id: 'florence',
      name: {
        es: 'Florencia',
        en: 'Florence',
      },
      destinationIds: ['florence', 'christmas-florence'],
    },
    {
      id: 'milan',
      name: {
        es: 'Milán',
        en: 'Milan',
      },
      destinationIds: ['milan', 'christmas-milan'],
    },
    {
      id: 'amalfi-coast',
      name: {
        es: 'Costa Amalfitana',
        en: 'Amalfi Coast',
      },
      destinationIds: ['amalfi-coast'],
    },
  ],
  jp: [
    {
      id: 'tokyo',
      name: {
        es: 'Tokio',
        en: 'Tokyo',
      },
      destinationIds: ['tokyo', 'christmas-tokyo'],
    },
    {
      id: 'kyoto',
      name: {
        es: 'Kioto',
        en: 'Kyoto',
      },
      destinationIds: ['kyoto'],
    },
    {
      id: 'osaka',
      name: {
        es: 'Osaka',
        en: 'Osaka',
      },
      destinationIds: ['osaka'],
    },
    {
      id: 'nara',
      name: {
        es: 'Nara',
        en: 'Nara',
      },
      destinationIds: ['nara'],
    },
    {
      id: 'mount-fuji',
      name: {
        es: 'Monte Fuji',
        en: 'Mount Fuji',
      },
      destinationIds: ['mount-fuji'],
    },
  ],
  mx: [
    {
      id: 'mexico-city',
      name: {
        es: 'Ciudad de México',
        en: 'Mexico City',
      },
      destinationIds: ['mexico-city', 'muertos-mexico-city', 'muertos-mixquic'],
    },
    {
      id: 'cancun',
      name: {
        es: 'Cancún',
        en: 'Cancún',
      },
      destinationIds: ['cancun'],
    },
    {
      id: 'riviera-maya',
      name: {
        es: 'Riviera Maya',
        en: 'Riviera Maya',
      },
      destinationIds: ['riviera-maya'],
    },
    {
      id: 'oaxaca',
      name: {
        es: 'Oaxaca',
        en: 'Oaxaca',
      },
      destinationIds: ['oaxaca', 'muertos-oaxaca'],
    },
    {
      id: 'los-cabos',
      name: {
        es: 'Los Cabos',
        en: 'Los Cabos',
      },
      destinationIds: ['los-cabos'],
    },
  ],
  us: [
    {
      id: 'miami',
      name: {
        es: 'Miami',
        en: 'Miami',
      },
      destinationIds: ['miami'],
    },
    {
      id: 'new-york',
      name: {
        es: 'Nueva York',
        en: 'New York',
      },
      destinationIds: ['new-york', 'christmas-new-york'],
    },
    {
      id: 'orlando',
      name: {
        es: 'Orlando',
        en: 'Orlando',
      },
      destinationIds: ['orlando'],
    },
    {
      id: 'las-vegas',
      name: {
        es: 'Las Vegas',
        en: 'Las Vegas',
      },
      destinationIds: ['las-vegas'],
    },
    {
      id: 'los-angeles',
      name: {
        es: 'Los Ángeles',
        en: 'Los Angeles',
      },
      destinationIds: ['los-angeles'],
    },
  ],
};
