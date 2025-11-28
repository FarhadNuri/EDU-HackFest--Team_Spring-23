import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let districtsCache = null;

export function loadDistricts() {
    if (districtsCache) {
        return districtsCache;
    }

    try {
        const csvPath = path.join(__dirname, '../../db_geocode.csv');
        const csvData = fs.readFileSync(csvPath, 'utf-8');
        
        const lines = csvData.split('\n').filter(line => line.trim());
        
        districtsCache = lines.map(line => {
            const [nameEn, nameBn, lat, lon] = line.split(',');
            return {
                nameEn: nameEn.trim(),
                nameBn: nameBn.trim(),
                latitude: parseFloat(lat),
                longitude: parseFloat(lon)
            };
        });

        return districtsCache;
    } catch (error) {
        console.error('Error loading districts CSV:', error);
        return [];
    }
}

export function getDistrictByName(name) {
    const districts = loadDistricts();
    return districts.find(d => 
        d.nameEn.toLowerCase() === name.toLowerCase() || 
        d.nameBn === name
    );
}

export function getAllDistricts() {
    return loadDistricts();
}
