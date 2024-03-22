// pokemonAPI.mjs
const baseURL = 'https://pokeapi.co/api/v2/';

// Función para obtener información específica sobre un Pokémon
export async function getPokemonInfo(pokemonName) {
    try {
        // Realizar una solicitud a la API de Pokémon para obtener información del Pokémon
        const response = await fetch(`${baseURL}pokemon/${pokemonName}`);
        const data = await response.json();

        const imagenURL = data.sprites.front_default;

        // Extraer y devolver solo la información necesaria sobre el Pokémon
        return {
            name: data.name, // Nombre del Pokémon
            attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat, // Ataque base del Pokémon
            base_experience: data.base_experience, // Experiencia base del Pokémon
            imagenURL: imagenURL
        };
    } catch (error) {
        // Capturar y manejar cualquier error que ocurra durante la solicitud
        throw new Error('Error fetching Pokemon info:', error);
    }
}