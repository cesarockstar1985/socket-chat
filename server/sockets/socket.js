const { Usuarios } = require('../classes/usuarios');
const { io } = require('../server');
const { crearMensajes } = require('../utils/utilidades');

const usuarios = new Usuarios()

io.on('connection', (client) => {

    client.on('entrarChat', ( usuario, callback ) => {

        if(!usuario.nombre){
            return callback({
                error: true,
                mensaje: ' El nombre/sala es necesario '
            })
        }

        client.join( usuario.sala )

        usuarios.agregarPersona( client.id, usuario.nombre, usuario.sala )

        client.broadcast.to( usuario.sala ).emit('listaPersonas', usuarios.getPersonasPorSala( usuario.sala ))
        client.broadcast.to( usuario.sala ).emit('crearMensaje', crearMensajes( 'Admin', `${ usuario.nombre } se unió` ))
        
        callback(usuarios.getPersonasPorSala( usuario.sala ));
    })
    
    client.on('disconnect', () => {
        const personaBorrada = usuarios.eliminarPersona(client.id)
        
        client.broadcast.to( personaBorrada.sala ).emit('crearMensaje', crearMensajes( 'Admin', `${ personaBorrada.nombre } salió` ))
        client.broadcast.to( personaBorrada.sala ).emit('listaPersonas', usuarios.getPersonasPorSala( personaBorrada.sala ))

    })

    client.on('crearMensaje', ( data, callback ) => {
        
        const { nombre, sala } = usuarios.getPersona(client.id)
        const { mensaje } = data

        const msg = crearMensajes( nombre, mensaje )
        client.to( sala ).broadcast.emit( 'crearMensaje', msg )

        callback( msg )
    })

    // Mensajes privados
    client.on('mensajePrivado', data => {

        const persona = usuarios.getPersona( client.id )
        client.broadcast.to( data.to ).emit('mensajePrivado', crearMensajes( persona.nombre, data.mensaje ))
    })

    client.on('getUsers', ( text, callback ) => {
        const users = usuarios.getPersonas().filter( user => user.nombre.includes( text ) )
        callback( users )
    })

});