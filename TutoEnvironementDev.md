
  

# Configuration de l'Environnement de Développement

  

  

Ce guide détaille les étapes pour mettre en place l'environnement de développement pour le projet "Touche moi l'image".

  

Il est applicable pour les architectures **ARM** et **Intel/AMD** .

  

  

## Prérequis

  

  

-  **Python 3** (version 3.10 ou supérieure recommandée) installé sur votre machine.

  

- Accès au terminal.

  

  

## Règle d'Or : Isolation

  

  

> [!ATTENTION]

  

>  **NE JAMAIS COPIER le dossier `venv` d'une machine à une autre.**

  

> Les environnements virtuels sont spécifiques à la machine (chemins absolus) et à l'architecture (binaires compilés).

  

> Si vous changez de PC, vous devez **refaire l'installation** ci-dessous.

  

  

## Installation pas à pas

  

  

### 1. Naviguer vers le dossier du serveur

  

  

Le code Python se trouve dans le dossier `serveur`. Depuis la racine du projet (`website`), exécutez :

  

  

```bash
cd  serveur
```

  

  

### 2. Créer l'environnement virtuel (venv)

  

  

Cette étape crée un dossier local contenant une copie isolée de Python.

  

  

**Sur Linux (ARM & Intel) :**

  

```bash
python3  -m  venv  venv
```

  

  

**Sur Windows :**

  

```bash
python  -m  venv  venv
```

  

  

### 3. Activer l'environnement virtuel

  

  

**Sur Linux :**

  

```bash
source  venv/bin/activate
```

  

*(Vous devriez voir `(venv)` apparaître au début de votre invite de commande)*

  

  

**Sur Windows (PowerShell) :**

  

```powershell
.\venv\Scripts\Activate
```

  

  

### 4. Installer les dépendances

  

Choisissez la commande correspondant à votre architecture.

  

#### Option A : Architecture ARM

  

**Dépendances principales :**

```bash

pip  install  -r  requirements-ARM.txt

```

  

**Dépendances de développement :**

```bash

pip  install  -r  requirements-dev-ARM.txt

```

  

#### Option B : Architecture Intel/AMD

  

**Dépendances principales :**

```bash

pip  install  -r  requirements.txt

```

  

**Dépendances de développement :**

```bash

pip  install  -r  requirements-dev.txt

```

  

  

### 5. Lancer le serveur

  

**Sur Linux :**

```bash
python3  server.py
```

**Sur Windows :**

```bash
python  server.py
```

  

  

Le front devrait être accessible sur `http://localhost:5000`.

Le back devrait être accessible sur `http://localhost:5173`.

  

### 6. Quitter

  

  

Pour sortir de l'environnement virtuel :

  

  

```bash
deactivate
```
