import express from "express";
import submit from "./endpoint/Index.js";
import IndexEndpoint from "./endpoint/Index.js";
import bodyParser from "body-parser";
import APIEndpoint from "./endpoint/API.js";

export default class ServeurWeb{
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
