export interface TagTemplate {
    id: string;
    label: string;
    icon: string;
    placeholder: string;
    defaultMetadata: Record<string, string>;
}

export const TAG_TEMPLATES: Record<string, TagTemplate> = {
    Produit: {
        id: "Produit",
        label: "Produit / Stock",
        icon: "📦",
        placeholder: "ex: B-2023-001",
        defaultMetadata: {
            "Lot": "",
            "Date_Expiration": "",
            "Quantité": ""
        }
    },
    Materiel: {
        id: "Materiel",
        label: "Matériel / Outil",
        icon: "🛠️",
        placeholder: "ex: PERFO-01",
        defaultMetadata: {
            "État": "Neuf",
            "Marque": "",
            "Prochaine_Entretien": ""
        }
    },
    Emplacement: {
        id: "Emplacement",
        label: "Emplacement",
        icon: "📍",
        placeholder: "ex: ALLÉE-A-01",
        defaultMetadata: {
            "Zone": "",
            "Capacité": "",
            "Type_Stockage": ""
        }
    },
    Document: {
        id: "Document",
        label: "Document",
        icon: "📄",
        placeholder: "ex: DOSSIER-2024-X",
        defaultMetadata: {
            "Type_Document": "",
            "Date_Archivage": "",
            "Responsable": ""
        }
    }
};
