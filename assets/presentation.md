# 🎤 Part 1: The 5-Minute Pitch (Slide Deck)
Aim for 5 to 6 slides maximum so you don't rush. Spend roughly 45–60 seconds per slide.

## Slide 1: Title & Introduction
Visual: Project name (SubLedger), your team members' names, and a quick one-liner (e.g., "Take control of your digital subscriptions").

Script:
- EN :"Hello everyone. Today we are presenting SubLedger, a FinTech backend API designed to help users track and manage their digital subscriptions. With so many streaming services and software today, subscription fatigue is a real problem. SubLedger is the solution."
- FR : "Bonjour à tous. Aujourd’hui, nous vous présentons SubLedger, une API backend FinTech conçue pour aider les utilisateurs à suivre et à gérer leurs abonnements numériques. Avec la multitude de services de streaming et de logiciels disponibles aujourd’hui, la « fatigue des abonnements » est un véritable problème. SubLedger est la solution."

## Slide 2: Project Objectives & Roles
Visual: Two icons showing "User Role" and "Admin Role" with bullet points of their capabilities.

- EN : "Our goal was to build a secure backend with two distinct roles. The User can create subscriptions, log transactions, and get financial summaries of their spending. The Admin has a global oversight role to monitor platform activity and user statistics."

- FR : Notre objectif était de mettre en place un backend sécurisé comportant deux rôles distincts. L'utilisateur peut créer des abonnements, enregistrer des transactions et obtenir des récapitulatifs financiers de ses dépenses. L'administrateur a pour rôle de superviser l'ensemble de l'activité de la plateforme et de suivre les statistiques des utilisateurs.

## Slide 3: Technical Stack & Security
Visual: Logos of Node.js, Express.js, MongoDB, Mongoose, JWT, and bcrypt.

- EN : "For the architecture, we built a RESTful API using Node.js and Express, connected to a MongoDB database via Mongoose. Security was a top priority: we implemented JWT for authentication, bcrypt for password hashing, and custom Express middlewares to ensure users can only access their own data."

- FR : "En ce qui concerne l'architecture, nous avons développé une API RESTful à l'aide de Node.js et d'Express, connectée à une base de données MongoDB via Mongoose. La sécurité était une priorité absolue : nous avons mis en place le protocole JWT pour l'authentification, l'algorithme bcrypt pour le hachage des mots de passe, ainsi que des middlewares Express personnalisés afin de garantir que les utilisateurs ne puissent accéder qu'à leurs propres données."


## Slide 4: Data Modeling & Architecture (UML)
Visual: Place screenshots of your UML Class Diagram and Use Case Diagram here.

- EN : "Here is a quick look at our data model. We have three main collections: Users, Subscriptions, and Transactions. We used references in Mongoose to link them together, ensuring every transaction belongs to a specific subscription, and every subscription to a user."

- FR : "Voici un aperçu de notre modèle de données. Nous avons trois collections principales : Utilisateurs, Abonnements et Transactions. Nous avons utilisé des références dans Mongoose pour les relier entre elles, afin de garantir que chaque transaction soit associée à un abonnement spécifique et que chaque abonnement soit associé à un utilisateur."

## Slide 5: Advanced Features & Bonuses
Visual: Bullet points highlighting: Pagination, Statistics Endpoint, and Bonus features.

- EN : "Beyond standard CRUD operations, we implemented pagination and filtering. We also completed the bonus features: a global financial summary endpoint, and a monthly spending limit that warns the user if a new transaction exceeds their budget."

- FR : "Au-delà des opérations CRUD standard, nous avons mis en place la pagination et le filtrage. Nous avons également finalisé les fonctionnalités supplémentaires : un "endpoint" de synthèse financière globale"