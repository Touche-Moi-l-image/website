const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://127.0.0.1:5000';

/**
 * Envoie un FormData vers une route et retourne le blob (image) renvoyé.
 * Champs fournis dans `fields` seront ajoutés au FormData.
 */
async function postForm(route, fields = {}) {
  const url = `${API_BASE}${route}`;
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });

  const res = await fetch(url, {
    method: 'POST',
    body: form ,
    headers: {
        // Ne pas définir 'Content-Type', le navigateur le fait automatiquement pour FormData
      'Access-Control-Allow-Origin': '*',
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${route} failed (${res.status}): ${text}`);
  }
  return res.blob();
}

export default {
  // Convertit une image en noir et blanc.
  // image_source : URL publique ou chemin côté serveur (string)
  convertToBW: (image_source) => postForm('/api/convert-to-bw', { image_source }),

  // Rotation : angle en degrés (number ou string)
  rotateImage: (image_source, angle) => postForm('/api/rotate-image', { image_source, angle }),

  // Flip : direction 'H' ou 'V'
  flipImage: (image_source, direction) => postForm('/api/flip-image', { image_source, direction }),

  // Blur : percent (0-100)
  blurImage: (image_source, percent) => postForm('/api/blur-image', { image_source, percent }),

  // Resize : x_percent et y_percent (nombres ou strings)
  resizeImage: (image_source, x_percent, y_percent) =>
    postForm('/api/resize-image', { image_source, x_percent, y_percent }),

  // Expose utile pour appels génériques/tests
  postForm,
};