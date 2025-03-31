import ServeurWeb from "./ServeurWeb.js";
import { getVitesseRPM, initialiserDonneesCSV } from "./utils/Lecteur.js";

export default class Application{
    
    constructor(){
        initialiserDonneesCSV("./static/final.csv");
        new ServeurWeb();
    }
}

new Application();
