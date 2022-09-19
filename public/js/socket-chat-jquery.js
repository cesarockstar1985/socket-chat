var params = new URLSearchParams(window.location.search)

// referncias de jQuery
const divUsuarios = $('#divUsuarios')

// Funciones para renderizar usuarios
const renderizarUsuarios = (personas) => { // [{}, {}, {}]

    let html = ''

    html += `<li>
                <a href="javascript:void(0)" class="active"> Chat de <span> ${ params.get('sala') }</span></a>
            </li>`

    for( let i = 0; i < personas.length; i++ ){
        html += `<li>
                    <a class="user-row" data-id="${ personas[i].id }" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${ personas[i].nombre } <small class="text-success">online</small></span></a>
                </li>`

    }

    divUsuarios.html(html)

}

// Listeners
$(document).on('click', '.user-row', function() {
    const id = $(this).data('id')
    console.log(id)
})
