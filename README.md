# CARSAT Dons Materiel - appli desktop Windows

Ce projet se compile automatiquement en .exe grace a GitHub Actions
(les serveurs de GitHub font la compilation a ta place, donc pas
besoin de telecharger Electron sur ton propre PC).


## Etape 1 : mettre le projet sur GitHub

1. Va sur https://github.com et connecte-toi avec ton compte
2. Clique sur le bouton vert "New" (ou le "+" en haut a droite puis
   "New repository")
3. Donne un nom au projet, par exemple "carsat-dons-materiel"
4. Laisse-le en "Public" ou mets-le en "Private" (les deux marchent,
   Private si tu preferes que ce soit prive)
5. NE COCHE PAS "Add a README file" (on en a deja un)
6. Clique sur "Create repository"

GitHub va t'afficher une page avec des commandes. Ignore-les, on va
faire plus simple :

7. Sur cette page, cherche le lien "uploading an existing file"
   (ou en francais "televerser un fichier existant")
8. Clique dessus
9. Glisse-depose TOUS les fichiers et dossiers de ce projet dans la
   zone (main.js, package.json, le dossier src, le dossier .github,
   le README, le .gitignore)
10. En bas de la page, clique sur "Commit changes" (bouton vert)


## Etape 2 : laisser GitHub compiler le .exe

1. Une fois les fichiers envoyes, clique sur l'onglet "Actions" en
   haut de la page de ton projet
2. Tu dois voir une compilation en cours (un point orange qui tourne)
   appelee "Build Windows exe"
3. Clique dessus pour voir le detail
4. Attends que ca devienne vert avec une coche (ca prend 3 a 5 minutes)


## Etape 3 : telecharger le .exe

1. Toujours sur cette page (la compilation terminee, en vert)
2. Descends en bas de page, dans la section "Artifacts"
3. Clique sur "CARSAT-Dons-Materiel-exe" pour le telecharger
4. Ca telecharge un fichier .zip : ouvre-le, le .exe est dedans


## Etape 4 : distribuer aux collegues

Le fichier .exe que tu viens d'extraire est pret a l'emploi. Tu peux
le mettre sur une cle USB, un dossier partage, etc. Chaque collegue
double-clique dessus, l'appli s'ouvre directement.


## Si tu modifies l'appli plus tard

Modifie les fichiers dans le dossier src (index.html, script.js,
style.css), puis renvoie-les sur GitHub (meme methode qu'a l'etape 1,
"uploading an existing file" pour remplacer les anciens). La
compilation se relance automatiquement, et un nouveau .exe sera
disponible dans Actions > Artifacts au bout de quelques minutes.


## Pourquoi cette methode et pas une installation classique

Le telechargement direct d'Electron etait bloque par le reseau /
antivirus du PC utilise pour le developpement. GitHub Actions
contourne ce probleme en faisant la compilation sur des serveurs
distants qui n'ont pas ce blocage. Le resultat final (le .exe) est
strictement identique.
