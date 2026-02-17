/**
 * Modèle de données enrichi pour QRTag
 * Supporte maintenant les champs dynamiques (metadata)
 */
export interface Tag {
  id: string;               // L'identifiant du QR Code (ex: QT-1234)
  reference: string | null; // Titre principal ou référence

  // Champs dynamiques : permet de stocker { "Propriétaire": "Jean", "État": "Neuf" }
  metadata: Record<string, string>;

  category?: string;       // Catégorie de l'actif (Stock, Matériel, etc.)
  isAssigned: boolean;      // Statut du tag
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Initialise un tag vide avec une structure prête pour les champs dynamiques
 */
export const createEmptyTag = (id: string): Tag => {
  return {
    id: id,
    reference: null,
    metadata: {}, // On commence avec un objet vide
    category: 'Produit',
    isAssigned: false,
    createdAt: new Date(),
  };
};