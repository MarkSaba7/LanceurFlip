import ServeurWeb from "./ServeurWeb.js";
import { getVitesseRPM, initialiserDonneesCSV } from "./utils/Lecteur.js";

export default class Application{
    
    constructor(){
        new ServeurWeb();
    }
}

//new Application();

initialiserDonneesCSV("./static/final.csv");
console.log(getVitesseRPM(1.9, 5.2));