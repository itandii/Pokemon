const baseUrl = 'https://pokeapi.co/api/v2/';

function crearCarta(pokemon){
    let article = document.createElement('article');
    article.classList.add('carta');
    article.innerHTML = `
    <img src="${pokemon.image}" alt="${pokemon.name}">
    <h3>${pokemon.name}</h3>
    <p>${pokemon.types.join(', ')}</p>
    <button class="ver-mas-btn" data-id="${pokemon.id}">Ver más</button>
    `;
    document.getElementById('render').appendChild(article);
}

async function obtenerPokemon(nombre){
    let respuestaApi = await fetch(`${baseUrl}pokemon/${nombre}`);
    let pokemon = await respuestaApi.json();
    let propiedadesPokemon = {
        name: pokemon.name,
        height: pokemon.height,
        id: pokemon.id,
        weight: pokemon.weight,
        image: pokemon.sprites.front_default,
        types: pokemon.types.map(type => type.type.name)
    };
    crearCarta(propiedadesPokemon);
}

async function obtenerListado(){
    let respuestaApi = await fetch(`${baseUrl}pokemon`);
    let listadoPokemons = await respuestaApi.json();
    console.log('informacion obtenerListado:',listadoPokemons.results);
    for (let index = 0; index < listadoPokemons.results.length; index++) {
        await obtenerPokemon(listadoPokemons.results[index].name);
    }
}

async function iniciar(){
    await obtenerListado();
}

async function mostrarInfoAdicional(event) {
    const pokemonId = event.target.dataset.id;
    const pokemonInfo = await obtenerInfoAdicional(pokemonId);

    // Mostrar la información adicional en un modal
    mostrarModal(pokemonInfo);
}

async function obtenerInfoAdicional(pokemonId) {
    let respuestaApi = await fetch(`${baseUrl}pokemon/${pokemonId}`);
    let pokemon = await respuestaApi.json();
    let propiedadesPokemon = {
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        abilities: pokemon.abilities.map(ability => ability.ability.name),
        moves: pokemon.moves.map(move => move.move.name)
    };
    return propiedadesPokemon;
}

function mostrarModal(pokemonInfo) {
    // Crear el contenido del modal
    const modalContent = `
    <div class="modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>${pokemonInfo.name}</h2>
            <p>Altura: ${pokemonInfo.height}</p>
            <p>Peso: ${pokemonInfo.weight}</p>
            <p>Habilidades: ${pokemonInfo.abilities.join(', ')}</p>
            <p>Movimientos: ${pokemonInfo.moves.join(', ')}</p>
        </div>
    </div>
    `;

    // Agregar el modal al cuerpo del documento
    document.body.insertAdjacentHTML('beforeend', modalContent);

    // Agregar evento de clic al botón de cierre del modal
    document.querySelector('.close-btn').addEventListener('click', cerrarModal);
}

function cerrarModal() {
    // Eliminar el modal del DOM al hacer clic en el botón de cierre
    document.querySelector('.modal').remove();
}

async function buscarPokemon(){
    let render = document.getElementById('render');
    render.innerHTML = ''; // Limpiar resultados anteriores
    let nombrePokemon = document.getElementById('nameInput').value.toLowerCase();
    if (nombrePokemon.trim() === '') { // Si el campo de búsqueda está vacío, mostrar todos los Pokémon nuevamente
        await obtenerListado();
    } else { // Si se proporciona un nombre de Pokémon, buscar solo ese Pokémon
        await obtenerPokemon(nombrePokemon);
    }
}

document.getElementById('searchBtn').addEventListener('click', buscarPokemon);

// Delegar el evento de clic en el contenedor render
document.getElementById('render').addEventListener('click', function(event) {
    if (event.target.classList.contains('ver-mas-btn')) {
        mostrarInfoAdicional(event);
    }
});

document.addEventListener('DOMContentLoaded', iniciar);
