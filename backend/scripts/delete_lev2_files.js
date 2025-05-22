// scripts/delete_lev2_files.js

const fs = require('fs');
const path = require('path');

// Ruta donde se buscarán los archivos
const modelsPath = 'A:/mundo3/game-project/public/models/toycar';

// Verificar si el directorio existe
if (!fs.existsSync(modelsPath)) {
    console.error('❌ El directorio no existe:', modelsPath);
    process.exit(1);
}

// Obtener lista de archivos
const files = fs.readdirSync(modelsPath);
let deletedCount = 0;

// Recorrer los archivos y eliminar los que contienen "lev2"
files.forEach(file => {
    if (file.includes('lev2')) {
        const filePath = path.join(modelsPath, file);
        try {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Archivo eliminado: ${file}`);
            deletedCount++;
        } catch (error) {
            console.error(`❌ Error al eliminar ${file}:`, error.message);
        }
    }
});

if (deletedCount > 0) {
    console.log(`\n✅ Se eliminaron ${deletedCount} archivos con "lev2" en su nombre.`);
} else {
    console.log('ℹ️ No se encontraron archivos que contengan "lev2" en su nombre.');
}