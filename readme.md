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

![Image d'origine](src/img/examples/base.png)

### 1. Transformation en noir et blanc
**Route :** `/api/convert-to-bw`

- **Méthode :** POST
- **Description :** Transforme une image en noir et blanc.
- **Paramètres :**
  - `image_source` : URL ou chemin local de l'image à transformer.

**Exemple d'image avant et après transformation :**

![Image transformée en noir et blanc](src/img/examples/bw.png)

---