const tabs = []

let tabOuverte = 0


function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabs.push(tabcontent[i].id)
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

document.getElementById("speedForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const speed = parseFloat(document.getElementById("speed").value);
    const angle = parseFloat(document.getElementById("angle").value);

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
    if (!reponse.ok) {
        montrerMessage(false, "Le serveur a repondu avec: " + reponse.status);
        return;
    }
    montrerMessage(true, "Les informations etaient envoyee au serveur");
    
    
});

document.getElementById("distanceForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const distance = parseFloat(document.getElementById("distance").value);

    const reponse = await fetch("http://localhost:8080/api/soumettre-distance", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            distance: distance
        })
    });
    if (!reponse.ok) {
        montrerMessage(false, "Le serveur a repondu avec: " + reponse.status);
        return;
    }
    montrerMessage(true, "Les informations etaient envoyee au serveur");
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

function montrerMessage(success, message) {
    const confirmation = document.getElementById("speedConfirmation");
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