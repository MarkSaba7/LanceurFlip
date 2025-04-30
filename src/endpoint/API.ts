import express, {Request, Response} from "express";
import fetch from 'node-fetch';
import { SerialPort } from 'serialport';
import { getVitesseRPM } from '../utils/Lecteur.js';

export default class APIEndpoint {
    private port: SerialPort | null = null;

    constructor(serveur: express.Express){
        // Tentative d'ouverture du port série avec gestion d'erreur
        try {
            // Liste des ports série possibles (Windows, Mac, Linux)
            const possiblePaths = ['COM3', 'COM4', '/dev/ttyUSB0', '/dev/ttyACM0', '/dev/cu.usbserial-*'];
            
            // On essaie d'abord COM3 (votre configuration originale)
            this.port = new SerialPort({
                path: 'COM3', // Modifier selon votre configuration
                baudRate: 115200,
                autoOpen: false // Ne pas ouvrir automatiquement pour gérer les erreurs
            });
            
            // Ouverture du port avec gestion d'erreur
            this.port.open((err) => {
                if (err) {
                    console.error("Erreur lors de l'ouverture du port série:", err.message);
                    console.log("Tentative de connection à d'autres ports série...");
                    
                    // Si COM3 ne fonctionne pas, essayez les autres ports
                    this.tryAlternativePorts(possiblePaths.filter(p => p !== 'COM3'));
                } else {
                    console.log("Port série ouvert avec succès sur COM3!");
                    this.setupSerialListeners();
                }
            });
            
        } catch (e) {
            console.error("Erreur lors de l'initialisation du port série:", e);
            console.log("Le serveur continuera à fonctionner sans communication série.");
        }

        // Configurer les routes
        serveur.post("/api/soumettre-vitesse", (req, rep) => this.submitVitesse(req, rep));
        serveur.post("/api/soumettre-distance", (req, rep) => this.submitDistance(req, rep));
        serveur.get("/api/port-status", (req, rep) => this.getPortStatus(req, rep));
    }

    private tryAlternativePorts(paths: string[]): void {
        if (paths.length === 0) {
            console.error("Aucun port série disponible. La communication avec Arduino ne sera pas disponible.");
            return;
        }

        const currentPath = paths[0];
        console.log(`Tentative de connexion au port ${currentPath}...`);

        try {
            this.port = new SerialPort({
                path: currentPath,
                baudRate: 115200,
                autoOpen: false
            });

            this.port.open((err) => {
                if (err) {
                    console.error(`Échec de connexion au port ${currentPath}:`, err.message);
                    // Essayer le prochain port
                    this.tryAlternativePorts(paths.slice(1));
                } else {
                    console.log(`Port série ouvert avec succès sur ${currentPath}!`);
                    this.setupSerialListeners();
                }
            });
        } catch (e) {
            console.error(`Erreur lors de l'initialisation du port ${currentPath}:`, e);
            // Essayer le prochain port
            this.tryAlternativePorts(paths.slice(1));
        }
    }

    private setupSerialListeners(): void {
        if (!this.port) return;

        // Écouter les données entrantes
        this.port.on('data', (data) => {
            console.log('Données reçues de l\'Arduino:', data.toString());
        });

        // Gérer les erreurs du port
        this.port.on('error', (err) => {
            console.error('Erreur port série:', err.message);
        });

        // Gérer la fermeture du port
        this.port.on('close', () => {
            console.log('Port série fermé');
        });
    }

    private getPortStatus(req: Request, rep: Response): void {
        const isConnected = this.port && this.port.isOpen;
        const portPath = this.port ? this.port.path : 'non connecté';
        
        rep.status(200).json({
            connected: isConnected,
            port: portPath
        });
    }

    private async submitVitesse(req: Request, rep: Response): Promise<void> {
        const requete = req.body as RequeteVitesse;
        console.log("Données reçues (vitesse):", requete);
        
        // Vérifier si le port série est disponible
        if (!this.port || !this.port.isOpen) {
            console.warn("Port série non disponible. Impossible d'envoyer les données.");
            rep.status(503).json({
                success: false,
                message: "Port série non disponible"
            });
            return;
        }
        
        try {
            // Formater les données comme attendu par l'Arduino
            const arduinoData = JSON.stringify({
                vitesse: requete.vitesse,
                angle: requete.angle
            }) + '\n';
            
            this.port.write(arduinoData, (err) => {
                if (err) {
                    console.error("Erreur port série:", err);
                    rep.status(500).json({
                        success: false,
                        message: "Erreur de communication avec Arduino"
                    });
                } else {
                    console.log("Données envoyées avec succès à l'Arduino:", arduinoData.trim());
                    rep.status(200).json({
                        success: true,
                        message: "Données envoyées avec succès",
                        data: requete
                    });
                }
            });
        } catch (error) {
            console.error("Exception lors de l'envoi des données:", error);
            rep.status(500).json({
                success: false, 
                message: "Erreur lors de l'envoi des données"
            });
        }
    }

    private async submitDistance(req: Request, rep: Response): Promise<void> {
        try {
            const requete = req.body as RequeteDistance;
            const angle = requete.angle || 0;
            
            console.log("Données reçues (distance):", requete);
            
            // Calculer la vitesse à partir de la distance
            const vitesse = getVitesseRPM(angle, requete.distance);
            console.log(`Distance: ${requete.distance}, Angle: ${angle} => Vitesse calculée: ${vitesse} RPM`);
            
            // Créer la requête vitesse
            const requeteVitesse: RequeteVitesse = {
                vitesse: vitesse,
                angle: angle
            };
            
            // Vérifier si le port série est disponible
            if (!this.port || !this.port.isOpen) {
                console.warn("Port série non disponible. Impossible d'envoyer les données.");
                rep.status(503).json({
                    success: false,
                    message: "Port série non disponible"
                });
                return;
            }
            
            // Formater les données comme attendu par l'Arduino
            const arduinoData = JSON.stringify(requeteVitesse) + '\n';
            
            // Envoyer les données
            this.port.write(arduinoData, (err) => {
                if (err) {
                    console.error("Erreur port série:", err);
                    rep.status(500).json({
                        success: false,
                        message: "Erreur de communication avec Arduino"
                    });
                } else {
                    console.log("Données envoyées avec succès à l'Arduino:", arduinoData.trim());
                    rep.status(200).json({
                        success: true,
                        message: "Données envoyées avec succès",
                        data: requeteVitesse
                    });
                }
            });
        } catch (error) {
            console.error("Erreur lors du traitement de la distance:", error);
            rep.status(500).json({
                success: false,
                message: `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
            });
        }
    }
}

type RequeteVitesse = {
    vitesse: number;
    angle: number;
}

type RequeteDistance = {
    distance: number;
    angle?: number;
}