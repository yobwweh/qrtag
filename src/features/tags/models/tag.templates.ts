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
    },
    Colis: {
        id: "Colis",
        label: "Colis / Expédition",
        icon: "📦",
        placeholder: "ex: TR-123456",
        defaultMetadata: {
            "Transporteur": "",
            "Poids": "",
            "Destination": ""
        }
    },
    Vehicule: {
        id: "Vehicule",
        label: "Véhicule / Flotte",
        icon: "🚚",
        placeholder: "ex: AA-123-BB",
        defaultMetadata: {
            "Modèle": "",
            "Kilométrage": "",
            "Dernier_Contrôle": ""
        }
    },
    Employe: {
        id: "Employe",
        label: "Badge Employé",
        icon: "👤",
        placeholder: "ex: EMP-889",
        defaultMetadata: {
            "Nom": "",
            "Poste": "",
            "Zone_Autorisée": ""
        }
    },
    Maintenance: {
        id: "Maintenance",
        label: "Point de Maintenance",
        icon: "⚙️",
        placeholder: "ex: CLIM-02",
        defaultMetadata: {
            "Fréquence": "Mensuel",
            "Dernier_Passage": "",
            "Technicien": ""
        }
    }
};
