import express, {Request, Response} from "express";
import path from "path";;
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Classe gérant le endpoint racine et la livraison des fichiers statiques
 */

export default class IndexEndpoint{
    private rootDir: string;
    
/**
     * Initialise le endpoint racine et configure le serveur Express
     * @param {express.Express} serveur - Instance du serveur Express
     * @param {string} [rootDir=path.join(__dirname, '../public')] - Chemin vers le dossier des fichiers statiques
     */

    constructor(serveur: express.Express, rootDir: string = path.join(__dirname, '../public')){
        this.rootDir = rootDir;
        serveur.get("/", (req, rep) => this.submit(req, rep));
    }

    /**
     * Gère la requête GET sur la racine et envoie le fichier index.html
     * @param {Request} req - Objet Request d'Express
     * @param {Response} rep - Objet Response d'Express
     */

    private submit(req: Request, rep: Response): void {
        rep.status(200).sendFile(path.join(this.rootDir, "index.html"));
    }
}