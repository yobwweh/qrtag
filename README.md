# QRTag Pro - Logistics Management System

**QRTag Pro** est une application web moderne de gestion logistique (WMS - Warehouse Management System) basée sur l'utilisation intensive de QR Codes pour le suivi d'inventaire en temps réel.

![QRTag Pro Banner](public/banner.png) <!-- Vous pourrez ajouter une image plus tard -->

## Fonctionnalités Clés

- **Authentification Sécurisée** : Système de connexion robuste géré par Supabase (Email/Mot de passe).
- **Scanner Mobile Intégré** : Scannez des QR Codes directement depuis le navigateur de votre smartphone/tablette sans application tierce.
- **Générateur de Tags (Admin)** : Créez et imprimez des planches de QR Codes uniques pour étiqueter vos produits.
- **Gestion d'Inventaire** :
  - **Injection** : Assignez un tag vierge à un produit/lot spécifique.
  - **Libération** : Réinitialisez un tag pour le réutiliser.
  - **Consultation** : Accédez instantanément aux détails d'un produit via son scan.
- **Sécurité** : Protection intégrale des routes sensibles via Middleware et Auth Guards.

## Stack Technique

Ce projet utilise les technologies les plus récentes pour garantir performance et maintenabilité :

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Style** : [Tailwind CSS](https://tailwindcss.com/)
- **Base de Données & Auth** : [Supabase](https://supabase.com/)
- **Scan** : `html5-qrcode` & `react-qr-code`
- **Déploiement** : [Vercel](https://vercel.com/)

## Installation et Démarrage

Suivez ces étapes pour lancer le projet en local :

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/qrtag.git
cd qrtag
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env.local` à la racine du projet et ajoutez vos clés Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

### 4. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

```
src/
├── app/                 # Routes Next.js (App Router)
│   ├── (auth)/          # Pages d'authentification
│   ├── dashboard/       # Tableau de bord principal
│   ├── scan/            # Module de scan
│   └── admin/           # Outils d'administration
├── components/          # Composants UI réutilisables
├── features/            # Logique métier par fonctionnalité
│   ├── auth/            # Services, Context, Views pour l'Auth
│   ├── scanner/         # Logique du lecteur QR
│   └── tags/            # Gestion des tags (CRUD)
└── lib/                 # Utilitaires et clients (Supabase)
```

## Contribuer

Les contributions sont les bienvenues ! Pour des changements majeurs, veuillez d'abord ouvrir une issue pour discuter de ce que vous souhaitez changer.

## Créateur

Développé avec ❤️ par **Yobwweh**

## Licence

[MIT](https://choosealicense.com/licenses/mit/)
