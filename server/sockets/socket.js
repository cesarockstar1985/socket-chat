const { Usuarios } = require('../classes/usuarios');
const { io } = require('../server');
const { crearMensajes } = require('../utils/utilidades');

const usuarios = new Usuarios()

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', ( usuario, callback ) => {

        console.log( usuario )
        
        if(!usuario.nombre){
            return callback({
                error: true,
                mensaje: ' El nombre/sala es necesario '
            })
        }

        client.join( usuario.sala )

        usuarios.agregarPersona( client.id, usuario.nombre, usuario.sala )

        client.broadcast.to( usuario.sala ).emit('listaPersonas', usuarios.getPersonasPorSala( usuario.sala ))
        
        console.log('llego hasta aca')

        callback(usuarios.getPersonasPorSala( usuario.sala ));
    })
    
    client.on('disconnect', () => {
        const personaBorrada = usuarios.eliminarPersona(client.id)
        
        client.broadcast.to( personaBorrada.sala ).emit('crearMensaje', crearMensajes( 'Admin', `${ personaBorrada.nombre } salió` ))
        client.broadcast.to( personaBorrada.sala ).emit('listaPersonas', usuarios.getPersonasPorSala( personaBorrada.sala ))

    })

    client.on('crearMensaje', ( data ) => {

        const persona = usuarios.getPersona(client.id)

        const mensaje = crearMensajes( persona.nombre, persona.mensaje )
        client.to( persona.sala ).broadcast.emit( 'crearMensaje', mensaje )
    })

    // Mensajes privados
    client.on('mensajePrivado', data => {

        const persona = usuarios.getPersona( client.id )
        client.broadcast.to( data.to ).emit('mensajePrivado', crearMensajes( persona.nombre, data.mensaje ))
    })

});