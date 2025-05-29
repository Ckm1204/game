import fs from 'fs';

// Ruta al archivo JSON
const filePath = 'A:/game/public/data/threejs_blocks.blocks.json';

try {
    // Leer el archivo
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    // Filtrar los objetos para excluir aquellos con "level": 2
    const filteredData = jsonData.filter(obj => obj.level !== 2);

    // Convertir los datos filtrados de nuevo a JSON
    const updatedJsonContent = JSON.stringify(filteredData, null, 2); // null, 2 para formatear con indentación

    // Escribir los cambios de nuevo al archivo
    fs.writeFileSync(filePath, updatedJsonContent, 'utf-8');

    const originalCount = jsonData.length;
    const finalCount = filteredData.length;
    const deletedCount = originalCount - finalCount;

    if (deletedCount > 0) {
        console.log(`✅ Se eliminaron ${deletedCount} objetos con "level": 2.`);
        console.log(`Número original de objetos: ${originalCount}`);
        console.log(`Número final de objetos: ${finalCount}`);
    } else {
        console.log('ℹ️ No se encontraron objetos con "level": 2 para eliminar.');
    }

    console.log(`✨ Archivo actualizado: ${filePath}`);

} catch (error) {
    console.error('❌ Error procesando el archivo JSON:', error.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
}