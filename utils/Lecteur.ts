import * as fs from 'fs';
import * as Papa from 'papaparse';



function readCsvFile(filePath: string): { angles: number[], distances: number[], velocities: number[]} {
        const angles: number[] = [];
        const distances: number[] = [];
        const vitesses: number[] = [];
    
        try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
    
        const parsedData = Papa.parse<>(fileContent, {
            header: true, 
            skipEmptyLines: true,
        });
 
        for (const row of parsedData.data) {
            if (row.Angle && row.Distance && row.Vx) {
            angles.push(parseFloat(row.Angle));       
            distances.push(parseFloat(row.Distance)); 
            vitesses.push(parseFloat(row.Vx));      
            }
        }
    
        console.log('yes');
        return { angles, distances, velocities: vitesses };
        } catch (error) {
        console.error('no:', error);
        throw error; 
    }
  
}
