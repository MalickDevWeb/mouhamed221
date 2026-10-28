export const environment = {
  production: true,
  /** URL de l'API Spring Boot (section 12.1 du cahier des charges). */
  apiBaseUrl: '/api/v1',
  /** false : les repositories HTTP appellent le backend réel. */
  useMockApi: true,
  /**
   * Stockage des fichiers : le navigateur envoie le fichier à Cloudinary,
   * puis transmet l'URL obtenue à l'API backend qui l'enregistre.
   * cloudName vide : stockage simulé dans le navigateur.
   */
  cloudinary: {
    cloudName: '',
    /** Preset « unsigned » créé dans la console Cloudinary (si pas de signature backend). */
    uploadPreset: '',
    folder: 'kai',
    /** Endpoint backend qui signe l'envoi (recommandé pour les pièces d'identité). null = envoi non signé. */
    signatureUrl: null as string | null,
  },
};
