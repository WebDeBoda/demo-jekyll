function cargarFormulario() {
    const numPersonas = parseInt(document.getElementById('forNumPersonas').value, 10);
    const contenedor = document.getElementById('contenedor-formulario');
    contenedor.innerHTML = ''; // Clear existing questions

    if (numPersonas > 0) {

        // Hacer desaparecer form de número de invitados
        const formularioNumPersonas = document.getElementById('FormNumeroPersonas');
        if (formularioNumPersonas)
            formularioNumPersonas.style.display = 'none';

        const formularioInvitados = document.getElementById('FormInvitados');
        formularioInvitados.style.display = 'block';

        for (let i = 1; i <= numPersonas; i++) {
            const section = document.createElement('div');

            section.innerHTML = `
                <h3>Invitado #${i}</h3>

                <!-- Nombre -->
                <div class="mb-4">
                <label class="form-label" for="ForNombre-${i}">Nombre y apellidos</label>
                <input type="text" class="form-control form-control-lg" name="FormNameFirstName" id="ForNombre-${i}" placeholder="Nombre y apellidos" aria-label="Nombre">
                </div>
                <!-- End Nombre-->

                <!-- Tipo de ménu -->
                <div class="mb-4">
                <label class="form-label" for="ForTipoMenu-${i}">Selecciona el menú que prefieras</label>
                <select class="form-select form-select-lg" id="ForTipoMenu-${i}" aria-label="Selecciona el menú">
                    <option selected>Normal</option>
                    <option value="Vegano">Vegano</option>
                    <option value="Vegetariano">Vegetariano</option>
                    <option value="Sin Gluten">Sin Gluten</option>
                    <option value="Infantil">Infantil</option>
                </select>
                </div>
                <!-- End Tipo de menú -->

                <!-- Alergias -->
                <div class="mb-3">
                <label for="ForAlergias-${i}" class="form-label">Alergias</label>
                <textarea class="form-control" name="ForNameAlergias" id="ForAlergias-${i}" placeholder="Indica tus alergias" aria-label="Indica tus alergias" rows="3"></textarea>
                </div>
                <!-- End Alergias -->

                <!-- Observaciones -->
                <div class="mb-3">
                <label for="ForObservaciones-${i}" class="form-label">Observaciones</label>
                <textarea class="form-control" name="ForNameAlergias" id="ForObservaciones-${i}" placeholder="¿Hay algo más que nos quieras decir?" aria-label="¿Hay algo más que nos quieras decir?" rows="3"></textarea>
                </div>
                <!-- End Observaciones -->
            `;
            contenedor.appendChild(section);
        }

    } else {
        alert('Por favor, introduzca un número válido de invitados.');
    }
}

function guardarInformacion(){

    // Mostrar el loader
    document.getElementById('loader').style.display = 'block';

    const numPersonas = parseInt(document.getElementById('forNumPersonas').value, 10);

    if (numPersonas > 0) {

        const respuestasPeticiones = [];
        var respuestaCAPTCHA = document.querySelector(".g-recaptcha-response").value;

        if (!respuestaCAPTCHA) {
            alert("Por favor, completa el reCAPTCHA.");
             // No mostrar el loader
            document.getElementById('loader').style.display = 'none';
            return false;
        } else {

            const invitados = [];

            for (let i = 1; i <= numPersonas; i++) {

                // Recoger la información introducida

                const nombre = document.getElementById(`ForNombre-${i}`).value;
                const tipoMenu = document.getElementById(`ForTipoMenu-${i}`).value;
                const alergias = document.getElementById(`ForAlergias-${i}`).value;
                const observaciones = document.getElementById(`ForObservaciones-${i}`).value;

                invitados.push({ nombre, tipoMenu, alergias, observaciones });

            }

            const url = "https://script.google.com/macros/s/AKfycbwtXHJ72Vj5X6gSsPCW5Ka8c0iTOEJbibgfUjdL_uHYKZ9mDz9ln11vxTuFiNUgQVTh/exec";

            const params = new URLSearchParams({
                invitados: JSON.stringify(invitados),
                respuestaCAPTCHA: respuestaCAPTCHA
            }).toString();

            // Send GET request to Google Apps Script
            respuestasPeticiones.push(
                fetch(`${url}?${params}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status != 'success') {
                            throw new Error(`Error: ${data.message}`);
                        }
                        return data.status;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        return 'error';
                    }) 

            );

            Promise.all(respuestasPeticiones)
                .then(statuses => {
                    if (statuses.every(status => status === 'success')) {
                        window.location.href = '/paginas/formulario-registro-ok.html';
                    } else {
                        window.location.href = '/paginas/formulario-registro-ko.html';
                    }
                });
        }

    }
}
