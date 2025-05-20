# Installation
1. Verifier que node est installee avec `node --version`
2. Executer `npm install`

# Execution
1. Execution sans compilation: `npm run run`
2. Execution avec compilation: `npm run bnr`
3. Compilation: `npm run build`

# Police d'execution Windows 11
Si `Get-ExecutionPolicy` dit `Restricted`, il faut simplement taper `Set-ExecutionPolicy Unrestricted` dans un terminal eleve avec des permissions administrateur

# Description du projet:
Ce projet consiste en la conception et la réalisation d’un lanceur automatique de frisbee capable de propulser un disque avec une certaine précision, en ajustant des paramètres clés tels que la vitesse et l’angle de lancement à partir d’un ordinateur. L’objectif est de créer un système mécanique et électronique permettant de reproduire un lancer contrôlé et reproductible, ouvrant ainsi des possibilités d’entrainement au joueur de Ultimate frisbee.
Le dispositif repose sur une maquette motorisée où un moteur, fixé à une roue, transmet une force de rotation pour propulser le frisbee. Lorsque la roue tourne à grande vitesse, elle entre en contact avec le disque, lui communiquant une énergie cinétique qui le projette vers l’avant. L’angle de sortie du frisbee peut être ajusté manuellement, permettant de moduler la trajectoire du frisbee.
