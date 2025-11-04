## Server
Pour run le serveur :

```bash
cd server
.\run_server.bat
```

## Utilisation de l'API

### Appeler l'API pour une image en ligne
Pour transformer une image en noir et blanc à partir d'une URL, effectuez une requête POST vers la route `/api/convert-to-bw` avec le champ `image_source` contenant l'URL de l'image.

Exemple de requête :
```bash
curl -X POST -F "image_source=https://example.com/image.jpg" http://127.0.0.1:5000/api/convert-to-bw --output output_image.png
```

### Appeler l'API pour une image locale
Pour transformer une image en noir et blanc à partir d'un fichier local, effectuez une requête POST vers la route `/api/convert-to-bw` avec le champ `image_source` contenant le chemin local de l'image.

Exemple de requête :
```bash
curl -X POST -F "image_source=C:/path/to/local/image.jpg" http://127.0.0.1:5000/api/convert-to-bw --output output_image.png
```

## Routes disponibles

**image d'origine :**

![Image d'origine](src/img/base.png)

### 1. Transformation en noir et blanc
**Route :** `/api/convert-to-bw`

- **Méthode :** POST
- **Description :** Transforme une image en noir et blanc.
- **Paramètres :**
  - `image_source` : URL ou chemin local de l'image à transformer.

**Exemple d'image avant et après transformation :**

![Image transformée en noir et blanc](src/img/bw.png)

---

### 2. Rotation d'une image
**Route :** `/api/rotate-image`

- **Méthode :** POST
- **Description :** Fait pivoter une image selon un angle donné (en degrés).
- **Paramètres :**
  - `image_source` : URL ou chemin local de l'image à transformer.
  - `angle` : Angle de rotation en degrés (positif pour horaire, négatif pour antihoraire).

**Exemple d'image avant et après transformation :**

![Image pivotée](src/img/rotated_image.png)
---

### 3. Effet miroir sur une image
**Route :** `/api/flip-image`

- **Méthode :** POST
- **Description :** Applique un effet miroir horizontal ou vertical à une image.
- **Paramètres :**
  - `image_source` : URL ou chemin local de l'image à transformer.
  - `direction` : `H` pour un miroir horizontal, `V` pour un miroir vertical.

**Exemple d'image avant et après transformation :**

![Image avec effet miroir](src/img/flipped_image.png)

---

### 4. Floutage d'une image
**Route :** `/api/blur-image`

- **Méthode :** POST
- **Description :** Applique un flou gaussien à une image selon un pourcentage donné.
- **Paramètres :**
  - `image_source` : URL ou chemin local de l'image à transformer.
  - `percent` : Pourcentage de floutage (0-100). Valeur par défaut : 50.

**Exemple d'image avant et après transformation :**

![Image floutée](src/img/blured_image.png)

---

### 5. Redimensionnement d'une image
**Route :** `/api/resize-image`

  - `image_source` : URL ou chemin local de l'image à transformer.
  - `x_percent` : Pourcentage de la largeur (par ex. 50 pour 50%).
  - `y_percent` : Pourcentage de la hauteur (par ex. 50 pour 50%).
  - Units: percentages (%) accepted as number or string with '%' suffix (e.g. 80 or '80%').

**Exemple d'appel :**

```bash
curl -X POST -F "image_source=C:/Users/quent/Desktop/github/website/src/img/base.png" -F "x_percent=50" -F "y_percent=120" http://127.0.0.1:5000/api/resize-image --output resized_image.png 
```

**Exemple d'image avant et après transformation :**

![Image redimensionnée](src/img/resized_image.png)
---
