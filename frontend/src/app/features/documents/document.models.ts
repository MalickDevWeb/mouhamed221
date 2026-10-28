import { StoredFile } from '../../core/files/file-storage';
import { BadgeTone } from '../../shared/ui/status-badge.component';

/** Types de pièces (EF-10). Liste définitive à valider par KAI (PO-04). */
export const DOCUMENT_TYPES = ['CNI', 'PERMIS', 'CARTE_GRISE', 'ASSURANCE', 'VISITE_TECHNIQUE', 'CASIER_JUDICIAIRE'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export interface DocumentTypeInfo {
  label: string;
  mandatory: boolean;
  /** Une pièce sans date d'expiration (casier) n'expire pas. */
  expires: boolean;
}

export const DOCUMENT_TYPE_INFO: Record<DocumentType, DocumentTypeInfo> = {
  CNI: { label: "Carte nationale d'identité", mandatory: true, expires: true },
  PERMIS: { label: 'Permis de conduire', mandatory: true, expires: true },
  CARTE_GRISE: { label: 'Carte grise', mandatory: true, expires: false },
  ASSURANCE: { label: "Attestation d'assurance", mandatory: true, expires: true },
  VISITE_TECHNIQUE: { label: 'Visite technique', mandatory: true, expires: true },
  CASIER_JUDICIAIRE: { label: 'Casier judiciaire', mandatory: false, expires: false },
};

/** Statut saisi par le vérificateur. */
export const REVIEW_STATUSES = ['A_VERIFIER', 'CONFORME', 'REJETEE'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

/** Statut affiché : l'expiration est calculée à partir de la date (EF-12). */
export type DocumentStatus = ReviewStatus | 'EXPIREE';

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  A_VERIFIER: 'À vérifier',
  CONFORME: 'Conforme',
  REJETEE: 'Rejetée',
  EXPIREE: 'Expirée',
};

export const DOCUMENT_STATUS_TONES: Record<DocumentStatus, BadgeTone> = {
  A_VERIFIER: 'info',
  CONFORME: 'success',
  REJETEE: 'danger',
  EXPIREE: 'danger',
};

export interface DriverDocument {
  id: string;
  driverId: string;
  type: DocumentType;
  number: string;
  issueDate: string | null;
  expiryDate: string | null;
  reviewStatus: ReviewStatus;
  rejectionReason: string | null;
  /** Fichier hébergé sur Cloudinary ; l'API ne stocke que ces métadonnées. */
  file: StoredFile;
  uploadedAt: string;
  uploadedBy: string;
  reviewedBy: string | null;
}

export interface NewDocument {
  type: DocumentType;
  number: string;
  issueDate: string | null;
  expiryDate: string | null;
  file: StoredFile;
}

export interface DocumentReview {
  status: Exclude<ReviewStatus, 'A_VERIFIER'>;
  reason: string | null;
}
