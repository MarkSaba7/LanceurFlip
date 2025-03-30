import express, {Request, Response} from "express";

export default class IndexEndpoint{
    constructor(serveur: express.Express){
        serveur.get("/", this.submit);
    }

    private submit(req: Request, rep: Response): void {
        rep.status(200).sendFile("index.html");
    }
}
