class Usuarios {

    constructor() {
        this.personas = []
    }

    agregarPersona(id, nombre, sala, image) {

        const persona = { id, nombre, sala, image }

        this.personas.push(persona)

        return this.personas

    }

    getPersona( id ) {

        let persona = this.personas.filter( persona => persona.id === id )[0]

        return persona

    }

    getPersonas() {
        return this.personas
    }

    getPersonasPorSala( sala ) {
        const personasEnSala = this.personas.filter( persona => persona.sala == sala )
        return personasEnSala
    }

    eliminarPersona(id) {
        let personaBorrada = this.getPersona(id)

        this.personas = this.personas.filter( persona => persona.id != id )

        return personaBorrada
    } 

}

module.exports = {
    Usuarios
}