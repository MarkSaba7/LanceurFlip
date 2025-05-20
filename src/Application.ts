import ServeurWeb from "./ServeurWeb.js";
import {initialiserDonneesCSV} from "./utils/Lecteur.js";

// Permet de tout initialiser et mettre en demmarage le serveur
export default class Application{
    
    constructor(){
        initialiserDonneesCSV("./static/final.csv");
        new ServeurWeb();
    }
}

new Application();
