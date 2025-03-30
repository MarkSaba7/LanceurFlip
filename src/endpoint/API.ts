import express, {Request, Response} from "express";

export default class APIEndpoint {
    constructor(serveur: express.Express){
        serveur.post("/api/soumettre-vitesse", (req, rep) => this.submitVitesse(req, rep));
        serveur.post("/api/soumettre-distance", (req, rep) => this.submitDistance(req, rep));
    }

    private submitVitesse(req: Request, rep: Response): void {
        const requete = req.body as RequeteVitesse;
        console.log("/api/soumettre-vitesse")
        console.log(requete);
        rep.status(200).send();
    }

    private submitDistance(req: Request, rep: Response): void {
        const requete = req.body as RequeteDistance;
        console.log("/api/soumettre-distance")
        console.log(requete);
        rep.status(200).send();
    }
}

type RequeteVitesse = {
    vitesse: number;
    angle: number;
}

type RequeteDistance = {
    distance: number;
}