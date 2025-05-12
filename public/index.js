const tabs = []

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        if (!tabs.includes(tabcontent[i].id)) {
            tabs.push(tabcontent[i].id);
        }
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function clearSpeedForm() {
    document.getElementById("speedForm").reset();
    document.getElementById("speedConfirmation").style.display = "none";
}

function clearDistanceForm() {
    document.getElementById("distanceForm").reset();
    document.getElementById("distanceConfirmation").style.display = "none";
}

// Vérifier l'état du port série au chargement
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("http://localhost:8080/api/port-status");
        if (response.ok) {
            const data = await response.json();
            if (!data.connected) {
                montrerMessageGlobal(
                    `Attention: Port série non connecté. Les commandes ne seront pas envoyées à l'Arduino.`,
                    false
                );
            } else {
                montrerMessageGlobal(
                    `Connecté à l'Arduino via le port ${data.port}`,
                    true
                );
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du port série:", error);
    }
});

document.getElementById("speedForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const speed = parseFloat(document.getElementById("speed").value);
    const angle = parseFloat(document.getElementById("angle").value);

    try {
        const reponse = await fetch("http://localhost:8080/api/soumettre-vitesse", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                vitesse: speed, 
                angle: angle
            })
        });
        
        const data = await reponse.json();
        
        if (!reponse.ok) {
            montrerMessage("speedConfirmation", false, data.message || `Le serveur a répondu avec: ${reponse.status}`);
            return;
        }
        
        montrerMessage("speedConfirmation", true, 
            `Commande vitesse envoyée avec succès: ${speed} RPM, angle: ${angle}°`);
            
    } catch (error) {
        console.error("Erreur lors de l'envoi des données:", error);
        montrerMessage("speedConfirmation", false, "Erreur de communication avec le serveur");
    }
});

document.getElementById("distanceForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    // Récupérer les éléments d'input
    const distanceInput = document.getElementById("distance");
    const angleInput = document.getElementById("distanceAngle");
    
    console.log("Élément distance trouvé:", distanceInput !== null);
    if (!distanceInput) {
        montrerMessage("distanceConfirmation", false, "Élément 'distance' introuvable dans le DOM");
        return;
    }
    
    console.log("Valeur brute de distance:", distanceInput.value);
    
    // Conversion explicite en nombres
    const distance = parseFloat(distanceInput.value);
    const angle = parseFloat(angleInput.value);
    
    console.log(`Distance après parseFloat: ${distance}, Type: ${typeof distance}, isNaN: ${isNaN(distance)}`);
    console.log(`Angle après parseFloat: ${angle}, Type: ${typeof angle}, isNaN: ${isNaN(angle)}`);

    // Vérification des valeurs avant envoi
    if (isNaN(distance)) {
        montrerMessage("distanceConfirmation", false, "La distance n'est pas un nombre valide");
        return;
    }
    
    if (isNaN(angle)) {
        montrerMessage("distanceConfirmation", false, "L'angle n'est pas un nombre valide");
        return;
    }

    try {
        // IMPORTANT: Assurez-vous que les noms des propriétés correspondent à ce que le backend attend
        const reponse = await fetch("http://localhost:8080/api/soumettre-distance", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                distance: distance,  // Cette propriété doit correspondre exactement à celle attendue dans RequeteDistance
                angle: angle
            })
        });
        
        const data = await reponse.json();
        
        if (!reponse.ok) {
            montrerMessage("distanceConfirmation", false, data.message || `Le serveur a répondu avec: ${reponse.status}`);
            return;
        }
        
        montrerMessage("distanceConfirmation", true, 
            `Commande distance envoyée avec succès: ${distance}m, angle: ${angle}°`);
            
    } catch (error) {
        console.error("Erreur lors de l'envoi des données:", error);
        montrerMessage("distanceConfirmation", false, "Erreur de communication avec le serveur");
    }
});

function validerNombre(str) {
    const valeur = parseFloat(str);
    if (isNaN(valeur)) {
        return {
            success: false, 
            message: "La valeur n'est pas un nombre"
        }
    } 
    return {
        success: true,
        valeur: valeur
    }
}

function montrerMessage(elementId, success, message) {
    const confirmation = document.getElementById(elementId);
    confirmation.style.display = "block";
    if (success) {
        confirmation.style.border = "1px solid #4CAF50";
        confirmation.style.backgroundColor = "#dff0d8";
        confirmation.style.color = "#3c763d";
    } else {
        confirmation.style.border = "1px solid rgb(185, 17, 17)";
        confirmation.style.backgroundColor = "#ff9f9f";
        confirmation.style.color = "#ff0000";
    }
    confirmation.innerHTML = message;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function montrerMessageGlobal(message, success) {
    // Créer un élément de message global s'il n'existe pas
    let messageGlobal = document.getElementById("messageGlobal");
    if (!messageGlobal) {
        messageGlobal = document.createElement("div");
        messageGlobal.id = "messageGlobal";
        messageGlobal.style.padding = "10px";
        messageGlobal.style.margin = "10px 0";
        messageGlobal.style.borderRadius = "4px";
        messageGlobal.style.textAlign = "center";
        document.querySelector("h1").after(messageGlobal);
    }
    
    // Appliquer le style en fonction du succès
    if (success) {
        messageGlobal.style.border = "1px solid #4CAF50";
        messageGlobal.style.backgroundColor = "#dff0d8";
        messageGlobal.style.color = "#3c763d";
    } else {
        messageGlobal.style.border = "1px solid rgb(185, 17, 17)";
        messageGlobal.style.backgroundColor = "#ff9f9f";
        messageGlobal.style.color = "#ff0000";
    }
    
    messageGlobal.innerHTML = message;
    messageGlobal.style.display = "block";
}