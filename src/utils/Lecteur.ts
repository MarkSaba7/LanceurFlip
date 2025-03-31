import * as fs from 'fs';

const referencesDistances: Map<number, Map<number, number>> = new Map();

export function initialiserDonneesCSV(filePath: string): void {
    const contenuFichier = fs.readFileSync(filePath).toString().split("\r\n");
    for (const ligne of contenuFichier) {
        const valeurs = ligne.split(",");
        const angle = parseFloat(valeurs[0])
        const vitesseRPM = parseFloat(valeurs[1])
        const distanceFinale = parseFloat(valeurs[2])
        
        if (referencesDistances.get(angle) != undefined) {
            referencesDistances.get(angle)?.set(distanceFinale, vitesseRPM);
        } else {
            const nouvelleReference = new Map();
            nouvelleReference.set(distanceFinale, vitesseRPM);
            referencesDistances.set(angle, nouvelleReference);
        } 
    }
}

export function getVitesseRPM(angle: number, distance: number): number {
    const angleClef = trouverValeurPlusProche(angle, referencesDistances);
    const distancesPossibles = referencesDistances.get(angleClef);
    const distanceClef = trouverValeurPlusProche(distance, distancesPossibles as Map<number, any>)
    return (referencesDistances.get(angleClef) as Map<number, any>).get(distanceClef);
}

function trouverValeurPlusProche(valeur: number, map: Map<number, any>): number {
    let cleAValeurMinimal: number = 0;
    let deltaValeurMinimal = Number.POSITIVE_INFINITY;
    
    for (const entree of map.entries()) {
        const angleClef = entree[0]
        const deltaAngle = Math.abs(angleClef - valeur);
        if (deltaAngle < deltaValeurMinimal) {
            cleAValeurMinimal = angleClef;
            deltaValeurMinimal = deltaAngle;
        }
    }

    return cleAValeurMinimal;
}