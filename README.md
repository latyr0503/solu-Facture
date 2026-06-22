# SoluFacture — SaaS de Facturation B2B

SoluFacture est une application web (SaaS) moderne conçue pour simplifier et professionnaliser la gestion de la facturation pour les petites et moyennes entreprises (TPE/PME) et les freelances. Elle vise à remplacer les processus fastidieux basés sur des fichiers Excel par une interface fluide, intuitive et automatisée.

> **Note :** Cette version est actuellement un prototype Frontend avancé. Les données et les états sont gérés localement via React Hooks pour démontrer l'interface utilisateur, la logique de calcul (TVA, HT, TTC) et les parcours de génération de factures. Aucun backend n'est connecté pour le moment.

## 🚀 Fonctionnalités Clés

* **Création de documents (Devis & Factures) :** 
  * Interface dynamique pour ajouter, modifier ou supprimer des lignes de prestation.
  * Calculs en temps réel des montants (Total HT, TVA à 18% par défaut, Total TTC).
  * Gestion complète de la date d'émission et de la date d'échéance/validité.
* **Gestion des statuts :** 
  * Changement de statut à la volée (*En attente*, *Payée*, *Annulée*) depuis la liste, la création ou la vue détaillée.
  * Feedback visuel immédiat avec badges de statut.
* **Impression & Génération PDF :** 
  * Outil d'impression sur mesure (`lib/print-invoice.ts`) contournant la navigation classique de la page pour une expérience instantanée.
  * Modèle de facture élégant et prêt à être sauvegardé en PDF.
* **Tableau de bord (Dashboard) :** 
  * Vue d'ensemble des dernières factures, de l'état des paiements et des métriques clés.
* **Paramètres personnalisables :** 
  * Modification des informations de l'entreprise (NINEA, RC, Adresse, Contact), de l'utilisateur et du mot de passe.
* **Design Premium B2B :** 
  * UI/UX épurée, responsive et moderne construite avec Tailwind CSS.
  * Prise en charge native du Mode Sombre (Dark Mode).

## 🛠️ Stack Technique

Ce projet est construit avec les technologies modernes du web pour assurer performance, typage strict et scalabilité :

- **Framework :** [Next.js 15+](https://nextjs.org/) (App Router)
- **Langage :** [TypeScript](https://www.typescriptlang.org/) (Typage strict activé)
- **Styling :** [Tailwind CSS v4](https://tailwindcss.com/)
- **Composants UI :** Construits sur mesure, avec des composants interactifs basés sur React.
- **Icônes :** [Lucide React](https://lucide.dev/)

## 📂 Architecture Principale

- `/app/dashboard` : Contient toutes les vues principales (Tableau de bord, Liste des factures, Création, Détail, Paramètres).
- `/components` : Composants réutilisables de l'interface (Formulaire de facture, Changeur de statut, Avatar utilisateur, etc.).
- `/lib` : Fonctions utilitaires, dont le moteur de génération d'impression PDF et les données simulées (Mocks).
- `/types` : Définitions TypeScript centralisées (Modèles de données pour Factures, Clients, Émetteur).

## 💻 Démarrage rapide

### Prérequis
Assurez-vous d'avoir [Node.js](https://nodejs.org/) (version 18 ou supérieure) et `pnpm` installés sur votre machine.

### Installation

1. **Cloner le dépôt :**
   ```bash
   git clone git@github.com:latyr0503/solu-Facture.git
   cd solu-facture
   ```

2. **Installer les dépendances :**
   ```bash
   pnpm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   pnpm run dev
   ```

4. **Accéder à l'application :**
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🔮 Prochaines étapes de développement

Pour passer de ce prototype à un SaaS complet prêt pour la production :

1. **Intégration d'un Backend (API) :** Remplacer les données *mockées* et les états locaux par des appels API (ex: Node.js/NestJS ou API Routes Next.js).
2. **Base de données :** Connecter PostgreSQL ou MongoDB avec un ORM comme Prisma ou Drizzle.
3. **Authentification :** Intégrer NextAuth.js, Clerk ou Firebase Auth pour gérer les sessions utilisateurs et la protection des routes de manière sécurisée.
4. **Gestion globale d'état :** Introduire Zustand ou Redux Toolkit si l'application gagne en complexité côté client.

---
*Conçu et développé dans le cadre d'un projet de facturation SaaS B2B.*
