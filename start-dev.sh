#!/bin/bash

# Couleurs pour les logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Démarrage du projet en mode développement...${NC}\n"

# Fonction pour nettoyer les processus en arrière-plan lors de l'arrêt du script
cleanup() {
    echo -e "\n${RED}🛑 Arrêt des serveurs...${NC}"
    kill $(jobs -p) 2>/dev/null
    return 0
}

trap cleanup SIGINT SIGTERM

# Lancement du front en mode dev
echo -e "${GREEN}🌐 Lancement du serveur front (dev)...${NC}"
cd front
npm install
npm run dev &
FRONT_PID=$!

cd ..

# Lancement du back
echo -e "${GREEN}🐍 Lancement du serveur back...${NC}"
cd serveur

# Vérifier si un environnement virtuel existe, sinon utiliser Python global
if [[ -d "venv" ]]; then
    source venv/bin/activate
    echo -e "${BLUE}Environnement virtuel activé${NC}"
fi

# Installer les dépendances si requirements.txt existe
if [[ -f "requirements.txt" ]]; then
    pip install -r requirements.txt
fi

export DEV=1
python3 server.py &
BACK_PID=$!

cd ..

echo -e "\n${GREEN}✅ Les serveurs sont démarrés en mode développement !${NC}"
echo -e "${BLUE}Front: http://localhost:5173${NC}"
echo -e "${BLUE}Back: http://localhost:5000${NC}"
echo -e "\n${RED}Appuyez sur Ctrl+C pour arrêter les serveurs${NC}\n"

# Attendre que les processus se terminent
wait $FRONT_PID $BACK_PID

