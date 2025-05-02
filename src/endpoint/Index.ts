import express, {Request, Response} from "express";
import path from "path";;
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class IndexEndpoint{
    private rootDir: string;
    
    constructor(serveur: express.Express, rootDir: string = path.join(__dirname, '../public')){
        this.rootDir = rootDir;
        serveur.get("/", (req, rep) => this.submit(req, rep));
    }

    private submit(req: Request, rep: Response): void {
        rep.status(200).sendFile(path.join(this.rootDir, "index.html"));
    }
}