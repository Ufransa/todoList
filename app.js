require('colors')

const { guardarDB, leerDB } = require('./helpers/guardarArchivo')
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

const main = async () => {

    let opcion = ''
    const tareas = new Tareas()

    const tareasDB = leerDB()

    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB)
    }

    do {

        opcion = await inquirerMenu()

        switch (opcion) {
            case '1':
                const desc = await leerInput('Descripción:')
                tareas.crearTarea(desc)
                break;

            case '2':
                tareas.listadoCompleto()
                break;

            case '3':
                tareas.listarPendientesCompletadas(true)
                break;

            case '4':
                tareas.listarPendientesCompletadas(false)
                break;

            case '5':
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
                break;

            case '6':
                const id = await listadoTareasBorrar( tareas.listadoArr )
                const ok = await confirmar('¿Estas seguro que desea borrarlo?')
                if (ok) {
                    tareas.borrarTarea( id )
                    console.log('Tarea borrada con éxito');
                }
                break;
        }

        guardarDB(tareas.listadoArr)

        if (opcion !== '0') await pausa()


    } while (opcion !== '0')

}

main()