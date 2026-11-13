# Atlas d'anatomie 3D

Atlas d'anatomie humaine en 3D, dans le navigateur, pour réviser : 3 895 structures et 1 120 repères osseux nommés en français, latin et anglais.

**Ouvrir l'atlas : https://bicolourdart968.github.io/Atlas-anatomie-3d/**

## Ce qu'il fait

- Couches à activer séparément : squelette, articulations, muscles, insertions, artères, veines, cœur, nerfs, viscères, lymphatique, fascias, régions.
- Toucher une structure donne son nom, sa place dans la hiérarchie, ses repères, puis permet de la masquer, l'isoler ou estomper le reste.
- Recherche par nom dans les trois langues.
- Mode dissection, quiz « Localiser », « Nommer » et « Fiches musculaires » (origine, terminaison, action, innervation), par chapitre du cours de bac 1 ou sur les couches affichées.
- Examen de dissection : épingles numérotées dans les régions des TP (abords postérieur et antérieur des membres pelvien et thoracique), placées sur les structures du dossier de TP, en plan superficiel ou profond.
- Vocabulaire du cours reconnu (« nerf honteux », « malléole tibiale », « EIAS »…). `COUVERTURE.md` liste ce que le cours contient et ce qui manque en 3D.
- Deux qualités : « Fluide » (modèles allégés, par défaut sur téléphone) et « Détaillée ».

## Lancer en local

Ouvrir `index.html` directement ne marche pas, le navigateur bloque le chargement des modèles depuis un fichier local. Il faut un petit serveur :

```
python3 -m http.server 8765
```

puis ouvrir http://localhost:8765/. Sous Windows, `Lancer (Windows).bat` fait la même chose sans Python.

## Contenu du dépôt

- `index.html`, `app.js` : l'application (three.js inclus dans `app.js`).
- `models/`, `lite/` : modèles 3D complets et allégés (glb compressé Draco, encodé en base64 dans du JSON).
- `data/` : index des structures, fiches et descriptions.
- `draco/` : décodeur Draco.

## Licence et attribution

Les modèles 3D viennent de « BodyParts3D, © The Database Center for Life Science », sous licence CC BY-SA 2.1 Japon, modifiés par Z-Anatomy (CC BY-SA 4.0), dans l'export web du projet [z-anatomy-atlas](https://github.com/jaydenpcastro-ship-it/z-anatomy-atlas). Les descriptions viennent de Wikipédia en anglais (CC BY-SA). Toute redistribution doit garder cette attribution et la même licence, voir `data/license.txt`.

Outil de révision, pas un avis médical.
