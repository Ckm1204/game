
import fs from 'fs';

/**
 * Genera un ObjectId similar a los de MongoDB.
 * @returns {string} Una cadena hexadecimal de 24 caracteres.
 */
function generateObjectId() {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
}

const inputFilePath = 'A:/game/src/scripts/toy_car_blocks1.json';
const outputFilePath = 'A:/game/src/scripts/level2.json'; // Basado en el comentario en tu código

try {
  // Leer el archivo JSON de entrada
  const inputFileContent = fs.readFileSync(inputFilePath, 'utf8');
  const inputArray = JSON.parse(inputFileContent);

  if (!Array.isArray(inputArray)) {
    console.error('Error: El contenido del archivo de entrada no es un array JSON.');
    // Podrías optar por salir o lanzar un error aquí
      // eslint-disable-next-line no-undef
    process.exit(1); 
  }

  // Transformar el array
  const outputJson = inputArray.map(item => {
    // Validar que el item tiene las propiedades esperadas del archivo toy_car_blocks_level2.json
    if (typeof item.name !== 'string' ||
        typeof item.x !== 'number' ||
        typeof item.y !== 'number' ||
        typeof item.z !== 'number' ||
        typeof item.level !== 'number') {
      console.warn('Advertencia: El item tiene propiedades faltantes o inválidas y será omitido:', item);
      return null; // Omitir este item
    }

    return {
      _id: {
        "$oid": generateObjectId()
      },
      name: item.name,
      x: item.x,
      y: item.y,
      z: item.z,
      level: item.level, // Este valor provendrá de toy_car_blocks_level2.json (ej. 2)
      role: "default",   // Rol por defecto para los items procesados por este script
      __v: 0
    };
  }).filter(item => item !== null); // Eliminar items nulos (los omitidos)

  // Escribir el archivo JSON de salida
  fs.writeFileSync(outputFilePath, JSON.stringify(outputJson, null, 2));
  console.log(`JSON generado exitosamente y guardado en ${outputFilePath}`);

} catch (error) {
  console.error("Error procesando el archivo JSON:", error.message);
  if (error instanceof SyntaxError) {
    console.error("Detalle: El archivo de entrada podría no ser un JSON válido.");
  }
}