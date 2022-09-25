var params = new URLSearchParams(window.location.search)

const baseUrl = 'http://localhost:3000'

const nombre = params.get('nombre')
const sala   = params.get('sala')

// referncias de jQuery
const divUsuarios = $('#divUsuarios')
const formEnviar  = $('#formEnviar')
const txtMensaje  = $('#txtMensaje')
const divChatbox  = $('#divChatbox')
const textoSala   = $('#titleSala')
const searchUser  = $('#searchUser')

const getSala = async () => {
    const request  = await fetch( baseUrl + '/salas/getSala/' + sala )
    const response = await request.json()

    const salaDB = response.sala

    return salaDB
} 

const nombreSala = async () => {
    const salaDB = await getSala()
    textoSala.text(salaDB.nombre)
}

// Funciones para renderizar usuarios
const renderizarUsuarios = async (personas) => { // [{}, {}, {}]

    let html = ''

    const salaDB = await getSala()

    html += `<li>
                <a href="javascript:void(0)" class="active"> Chat de <span> ${ salaDB.nombre }</span></a>
            </li>`

    for( let i = 0; i < personas.length; i++ ){
        html += `<li>
                    <a class="user-row" data-id="${ personas[i].id }" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${ personas[i].nombre } <small class="text-success">online</small></span></a>
                </li>`

    }

    divUsuarios.html(html)

}

// Listeners
divUsuarios.on('click', '.user-row', function() {
    const id = $(this).data('id')
    console.log(id)
})

formEnviar.on('submit', function(e){
    e.preventDefault()

    if( txtMensaje.val().trim().length === 0 )
        return

    const datosMensaje = {
        nombre,
        mensaje: txtMensaje.val()
    }

    // Enviar información
    socket.emit('crearMensaje', datosMensaje, function( mensaje ) {
        txtMensaje.val('').focus()
        renderizarMensajes( mensaje, true )
        scrollBottom()
    });
})

searchUser.keyup(function(){
    const searchText = $(this).val()

    socket.emit('getUsers', searchText, ( users ) => {
        // console.log( users );
        renderizarUsuarios( users )
    })
})

function renderizarMensajes( msg, yo ){
    const { nombre, mensaje, fecha } = msg
    
    let html = '';
    let fechaNew = new Date( fecha )
    let hora = fechaNew.getHours() + ':' + fechaNew.getMinutes()

    let adminClass = 'info'
    let image = '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'

    if( nombre === 'Admin' ){
        adminClass = 'danger'
        image = ''
    }

    if( yo ){
        html += `<li class="reverse">
                    <div class="chat-content">
                        <h5>${ nombre }</h5>
                        <div class="box bg-light-inverse">${ mensaje }</div>
                    </div>
                    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                    <div class="chat-time">${ hora }</div>
                 </li>`
    } else {
        html += `<li class="animated fadeIn">
                    ${ image }
                    <div class="chat-content">
                        <h5>${ nombre }</h5>
                        <div class="box bg-light-${ adminClass }">${ mensaje }</div>
                    </div>
                    <div class="chat-time">${ hora }</div>
                 </li>`
    }
    

    divChatbox.append(html)
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
