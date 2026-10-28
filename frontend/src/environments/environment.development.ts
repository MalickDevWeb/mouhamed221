export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1',
  /** true : données fictives en mémoire tant que le backend n'existe pas. */
  useMockApi: true,
  /** Renseigner cloudName et uploadPreset pour envoyer réellement les fichiers sur Cloudinary. */
  cloudinary: {
    cloudName: '',
    uploadPreset: '',
    folder: 'kai-dev',
    signatureUrl: null as string | null,
  },
};
