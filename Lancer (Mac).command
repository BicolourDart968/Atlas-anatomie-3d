#!/bin/bash
# Petit serveur local pour l'Atlas d'anatomie 3D (Mac). Fermez la fenêtre pour l'arrêter.
cd "$(dirname "$0")"
(sleep 1; open "http://localhost:8765/") &
python3 -m http.server 8765
