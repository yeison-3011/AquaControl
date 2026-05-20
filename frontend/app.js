const usuario =
JSON.parse(localStorage.getItem('usuario'));


// ===============================
// PROTEGER DASHBOARD
// ===============================

if(
    window.location.pathname.includes('dashboard.html')
    && !usuario
){
    window.location.href = 'login.html';
}


// ===============================
// MOSTRAR USUARIO ACTIVO
// ===============================

//if(usuario && document.getElementById('usuarioActivo')){

    //document.getElementById('usuarioActivo').innerText =
    //`Bienvenido ${usuario.nombre}`;
//}


// ===============================
// LOGIN
// ===============================

const formLogin = document.getElementById('formLogin');

if(formLogin){

    formLogin.addEventListener('submit', async (e) => {

        e.preventDefault();

        const correo =
        document.getElementById('loginCorreo').value;

        const password =
        document.getElementById('loginPassword').value;

        const respuesta = await fetch(
            'http://localhost:3000/api/usuarios/login',
            {

                method:'POST',

                headers:{
                    'Content-Type':'application/json'
                },

                body: JSON.stringify({
                    correo,
                    password
                })

            }
        );

        const data = await respuesta.json();

        document.getElementById('mensajeLogin').innerText =
        data.mensaje;

        if(data.usuario){

            localStorage.setItem(
                'usuario',
                JSON.stringify(data.usuario)
            );

            window.location.href = 'dashboard.html';

        }

    });

}


// ===============================
// REGISTRO
// ===============================

const formRegistro =
document.getElementById('formRegistro');

if(formRegistro){

    formRegistro.addEventListener('submit', async (e) => {

        e.preventDefault();

        const nombre =
        document.getElementById('nombre').value;

        const correo =
        document.getElementById('correo').value;

        const password =
        document.getElementById('password').value;

        const respuesta = await fetch(
            'http://localhost:3000/api/usuarios/registro',
            {

                method:'POST',

                headers:{
                    'Content-Type':'application/json'
                },

                body: JSON.stringify({
                    nombre,
                    correo,
                    password
                })

            }
        );

        const data = await respuesta.json();

        document.getElementById('mensajeRegistro').innerText =
        data.mensaje;

        formRegistro.reset();

        setTimeout(() => {

            window.location.href = 'login.html';

        }, 2000);

    });

}


// ===============================
// DASHBOARD
// ===============================

const formulario =
document.getElementById('formConsumo');

const ctx =
document.getElementById('graficaConsumo');

let grafica;

if(ctx){

    grafica = new Chart(ctx, {

        type: 'bar',

        data: {

            labels: [],

            datasets: [{

                label: 'Litros Consumidos',

                data: []

            }]
        }

    });

}


// ===============================
// CARGAR CONSUMOS
// ===============================

async function cargarConsumos(){

    if(!document.getElementById('listaConsumos')){
        return;
    }

    const respuesta = await fetch(
        'http://localhost:3000/api/consumos/listar'
    );

    const consumos = await respuesta.json();

    const lista =
    document.getElementById('listaConsumos');

    lista.innerHTML = '';

    grafica.data.labels = [];

    grafica.data.datasets[0].data = [];

    let total = 0;

    consumos.forEach(consumo => {

        const item =
        document.createElement('li');

        item.innerText =
        `${consumo.litros} litros - ${consumo.fecha}`;

        lista.appendChild(item);

        grafica.data.labels.push(consumo.fecha);

        grafica.data.datasets[0].data.push(
            consumo.litros
        );

        total += consumo.litros;

    });

    grafica.update();

    document.getElementById('totalLitros').innerText =
    `${total} Litros`;

    const promedio = consumos.length > 0
    ? (total / consumos.length).toFixed(2)
    : 0;

    document.getElementById('promedioLitros').innerText =
    `${promedio} Litros`;

    if(promedio > 50){

        document.getElementById('estadoConsumo').innerText =
        'Consumo Alto ⚠️';

    } else {

        document.getElementById('estadoConsumo').innerText =
        'Consumo Normal ✅';

    }

}


// ===============================
// REGISTRAR CONSUMO
// ===============================

if(formulario){

    cargarConsumos();

    formulario.addEventListener('submit', async (e) => {

        e.preventDefault();

        const litros =
        document.getElementById('litros').value;

        const fecha =
        document.getElementById('fecha').value;

        const respuesta = await fetch(
            'http://localhost:3000/api/consumos/registrar',
            {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    litros,
                    fecha
                })

            }
        );

        const data = await respuesta.json();

        document.getElementById('mensaje').innerText =
        data.mensaje;

        formulario.reset();

        cargarConsumos();

    });

}


// ===============================
// CAMBIAR SECCIONES
// ===============================

function mostrarSeccion(seccion){

    const consumo =
    document.getElementById('seccionConsumo');

    const reportes =
    document.getElementById('seccionReportes');

    if(seccion === 'consumo'){

        consumo.style.display = 'block';

        reportes.style.display = 'none';

    }

    if(seccion === 'reportes'){

        consumo.style.display = 'none';

        reportes.style.display = 'block';

    }

}


// ===============================
// CERRAR SESION
// ===============================

function cerrarSesion(){

    localStorage.removeItem('usuario');

    window.location.href = 'login.html';

}


// ===============================
// EXPORTAR PDF
// ===============================

async function exportarPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
        'Reporte AquaControl Cali',
        20,
        20
    );

    const respuesta = await fetch(
        'http://localhost:3000/api/consumos/listar'
    );

    const consumos = await respuesta.json();

    let y = 40;

    consumos.forEach(consumo => {

        doc.text(
            `${consumo.fecha} - ${consumo.litros} litros`,
            20,
            y
        );

        y += 10;

    });

    doc.save('reporte_consumo.pdf');

}