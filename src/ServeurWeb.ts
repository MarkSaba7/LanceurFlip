import express from "express";
import IndexEndpoint from "./endpoint/Index.js";
import bodyParser from "body-parser";
import APIEndpoint from "./endpoint/API.js";

export default class ServeurWeb{
    // Demarre le serveur pour pouvoir tout traiter et initialiser.
    // Permet de choisir le port pour le serveur
    public static instance: ServeurWeb;

    constructor(){
        ServeurWeb.instance = this;
        const app = express();
        app.set("view-engine", "html");
        app.use(express.static("public"));
        app.use(bodyParser.json());

        new IndexEndpoint(app);
        new APIEndpoint(app);

        app.listen(8080, () => {
            console.log("Le serveur est actif!");
        });
    }
}
