async function cargarRegalos() {

    const filePath = '/assets/regalos.csv';
    const response = await fetch(filePath);
    const csvData = await response.text();

    // Parse CSV data
    Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        delimiter: ";", // Cambiar el delimitador a punto y coma
        complete: function (results) {
            const data = results.data;

            data.forEach(row => {
                console.log(row); // Imprime la fila en la consola
            });

            // Find the record with the matching id
            $(`#RecargarRegalos`).remove();
            var secciones = [];
            data.forEach(row => {
                if (!secciones.includes(row.Seccion)) {
                    secciones.push(row.Seccion);
                    const seccionId = row.Seccion.replace(/\s+/g, '');
                    $('#regalos').append(`
                        <!-- Sección -->
                        <div class="text-center mx-lg-auto">
                            <h3 class="divider-center mb-5">${row.Seccion}</h3>
                            <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 gx-7 justify-content-center" id="${seccionId}"></div>
                        </div>
                        <!-- End Sección -->
                    `);
                }
                $(`#${row.Seccion.replace(/\s+/g, '')}`).append(`
                    <!-- Col -->
                    <div class="col mb-7 mb-md-10">
                        <!-- Card -->
                        <div class="card card-ghost card-transition-zoom h-100">
                            <a data-bs-toggle="collapse" href="#${row.Regalo}IBAN" role="button" onclick="document.getElementById('${row.Regalo}Imagen').scrollIntoView({ behavior: 'smooth'});">
                                <!-- Foto -->
                                <div class="card-pinned card-transition-zoom-item" id="${row.Regalo}Imagen" >
                                    <img class="card-img" src="${row.imagen}" alt="Image Description">
                                </div>
                                <!-- Texto -->
                                <div class="card-body">
                                    <h4>${row.titulo}</h4>
                                    <p class="card-text">${row.descripcion}</p>
                                </div>

                                <!-- Barra de progreso -->
                                <div class="progress mb-3" style="height: 15px;">
                                    <div id="${row.Regalo}" class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: ${(row.Recaudado / row.Coste_Total) * 100}%">${Math.min(100,Math.round((row.Recaudado / row.Coste_Total) * 100))}%</div>
                                </div>
                                <!-- Participa -->
                                <div class="card-footer text-start">
                                    <span class="card-link">Regalar</span>
                                </div>
                            </a>
                            <!-- End Card -->
                            <!-- IBAN -->
                            <div class="collapse mt-5" id="${row.Regalo}IBAN">
                                <div class="alert alert-soft-primary" role="alert">
                                    <b>IBAN:</b> ES8515830001129192861889
                                    <br>
                                    <b>Código BIC/SWIFT:</b> REVOESM2
                                    <br>
                                    <b>Concepto:</b> ${row.concepto}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- End Col -->
                `);
            });
        },
        error: function (error) {
            alert("Error parsing CSV file: " + error.message);
        }
    });
}

async function cargarHoteles() {

    const filePath = '/assets/hoteles.csv';
    const response = await fetch(filePath);
    const csvData = await response.text();

    // Parse CSV data
    Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        delimiter: ";", // Cambiar el delimitador a punto y coma
        complete: function (results) {
            const data = results.data;

            data.forEach(row => {
            });

            // Find the record with the matching id
            $('#hoteles').empty();
            data.forEach(row => {
                console.log(row); // Imprime la fila en la consola
                $('#hoteles').append(`
                <!-- Slide -->
                  <div class="swiper-slide pt-4 pb-8">
                    <!-- Card -->
                    <a class="card card-transition" href="${row.Anotaciones ? '#' : row.Web}" ${row.Anotaciones ? `data-bs-toggle="modal" data-bs-target="#modal${row.id}"` : 'target="_blank"'}>
                      <div class="card-pinned">
                        <img class="card-img-top" src="${row.Imagen}" alt="Image Description">
                        <span class="badge bg-dark text-white card-pinned-top-end fs-4">
                        ${isNaN(row.Estrellas)
                            ? row.Estrellas
                            : '★'.repeat(row.Estrellas) + '☆'.repeat(5 - row.Estrellas)}
                        </span>
                        ${row.Descuento ? `<div class="bg-success text-bg-success text-center p-2" style="position: absolute; bottom: 0; left: 0; width: 100%;">${row.Descuento}</div>` : ''}
                      </div>
                      <div class="card-body">
                        <h5 class="card-title">${row.Nombre}</h5>

                      </div>
                      <div class="card-footer pt0">
                        <div class="bg-light rounded mb-2 p-2">
                            <h5 class="text-secondary">Distancia al pazo</h5>
                            <p class="">
                                <i class="bi-geo-fill text-primary"></i> ${row.Distancia_metros} metros
                                <br>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-walking text-primary" viewBox="0 0 16 16">
                                    <path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M6.44 3.752A.75.75 0 0 1 7 3.5h1.445c.742 0 1.32.643 1.243 1.38l-.43 4.083a1.8 1.8 0 0 1-.088.395l-.318.906.213.242a.8.8 0 0 1 .114.175l2 4.25a.75.75 0 1 1-1.357.638l-1.956-4.154-1.68-1.921A.75.75 0 0 1 6 8.96l.138-2.613-.435.489-.464 2.786a.75.75 0 1 1-1.48-.246l.5-3a.75.75 0 0 1 .18-.375l2-2.25Z"/>
                                    <path d="M6.25 11.745v-1.418l1.204 1.375.261.524a.8.8 0 0 1-.12.231l-2.5 3.25a.75.75 0 1 1-1.19-.914zm4.22-4.215-.494-.494.205-1.843.006-.067 1.124 1.124h1.44a.75.75 0 0 1 0 1.5H11a.75.75 0 0 1-.531-.22Z"/>
                                </svg> ${row.Distancia_tiempo} minutos
                                <br>
                            </p>
                        </div>
                        <span class="card-link">${row.Anotaciones ? 'Ver anotaciones' : 'Ir a la web'}</span>
                      </div>
                    </a>
                    <!-- End Card -->
                  </div>
                  <!-- End Slide -->
                `);
            });
            if ($('#hoteles').children().length > 0) {
                $('#arrows').show();
            }

            data.forEach(row => {
                console.log(row); // Imprime la fila en la consola
                $('#modalesHoteles').append(`
                    ${row.Anotaciones ? `
                    <!-- Modal -->
                    <div class="modal fade" id="modal${row.id}" tabindex="-1" aria-labelledby="modalLabel${row.id}" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header text-center">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                            <img class="card-img-top mt-3" src="${row.Imagen}" alt="Image Description">
                          <div class="modal-body text-dark">
                            <h3 class="modal-title" id="modalLabel${row.id}">${row.Nombre}</h3>
                            <p>${row.Anotaciones}</p>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <a type="button" class="btn btn-primary" href="${row.Web}" target="_blank">Reservar</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- End Modal -->
                    ` : ''}
                `);
            });
            if ($('#hoteles').children().length > 0) {
                $('#arrows').show();
            }
        },
        error: function (error) {
            alert("Error parsing CSV file: " + error.message);
        }
    });
}

