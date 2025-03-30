function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
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
    

    let speed = document.getElementById("speed").value;
    let angle = document.getElementById("angle").value;
    const vitesseValidee = validerNombre(speed);
    if (!vitesseValidee.success) { 
        montrerMessage(false, "La vitesse n'est pas une valeur")
        return;
    }
    const angleValide = validerNombre(angle);
    if (!angleValide.success) { 
        montrerMessage(false, "L'angle n'est pas une valeur")
        return;
    }

    const reponse = await fetch("http://localhost:8080/api/soumettre-vitesse", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            vitesse: vitesseValidee.valeur, 
            angle: angleValide.valeur
        })
    });
    if (!reponse.ok) {
        montrerMessage(false, "Le serveur a repondu avec: " + reponse.status);
        return;
    }
    montrerMessage(true, "Les informations etaient envoyee au serveur");
    
    
});

document.getElementById("distanceForm").addEventListener("submit", function(e) {
    e.preventDefault();
    var distance = document.getElementById("distance").value;
    var confirmation = document.getElementById("distanceConfirmation");
    
    confirmation.innerHTML = "Paramètre validé:<br>Distance finale: " + distance + " cm";
    confirmation.style.display = "block";
    
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        confirmation.style.color = "#3c763d";
    } else {
        confirmation.style.border = "1px solid rgb(185, 17, 17)";
        confirmation.style.color = "#ff0000";
    }
    confirmation.innerHTML = message;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}