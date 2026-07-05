# FiveM Vehicle Templates

## 📖 À propos de ce dépôt
Ce dépôt centralise les templates des véhicules utilisés sur notre serveur FiveM. Il sert de base de données visuelle pour faciliter la création de livrées (liveries) par la communauté et l'équipe de développement.
L'interface web associée permet de rechercher, prévisualiser et télécharger facilement ces templates.

## 🛠 Comment contribuer ?
Vous souhaitez ajouter le template d'un nouveau véhicule ou corriger un gabarit existant ? Toute contribution est la bienvenue ! Voici la marche à suivre pour proposer un ajout :

1. **Forkez** ce dépôt sur votre propre compte GitHub (bouton "Fork" en haut à droite).
2. **Ajoutez vos fichiers images** dans le dossier `templates/` en respectant scrupuleusement la [convention de nommage](#-convention-de-nommage).
3. **Commitez et poussez** (push) vos modifications sur votre fork.
4. **Créez une Pull Request (PR)** vers la branche principale de ce dépôt. Décrivez brièvement quel(s) véhicule(s) vous ajoutez.
5. Un membre de l'équipe vérifiera votre PR. Une fois validée (Squash and Merge), vos ajouts seront automatiquement déployés sur le site web via GitHub Actions !

> [!IMPORTANT]
> **Sécurité des Workflows** : Si c'est votre première contribution, un administrateur devra approuver manuellement l'exécution du workflow GitHub Actions sur votre Pull Request avant qu'elle ne puisse être fusionnée.
> Ne modifiez pas les fichiers du code source du site web (`index.html`, `script.js`, etc.) si votre seul but est d'ajouter une image de template.

## 📝 Convention de nommage
Pour que les templates soient correctement indexés et affichés par le site web, **il est impératif de respecter les règles suivantes** pour le nom des fichiers ajoutés dans le dossier `templates/` :

- **Format de l'image** : Utilisez obligatoirement le format `.png` (recommandé pour la transparence) ou éventuellement `.jpg`.
- **Nom du fichier** : Le nom du fichier doit correspondre exactement au **spawn name** du véhicule en jeu (ou à son identifiant technique).
- **Casse** : Tout le nom doit être en **minuscules**. Aucune lettre majuscule n'est autorisée.
- **Caractères spéciaux** : N'utilisez **aucun espace**. Séparez les mots par des underscores `_` si nécessaire, bien que tout attaché soit préférable si le spawn name l'est.

**✅ Exemples corrects :**
- `buffalostxcommun.png`
- `onx_polalamo.png`
- `bisoncommun2.png`

**❌ Exemples INCORRECTS :**
- `Buffalo STX.png` (Contient des majuscules et un espace)
- `police-alamo.png` (Contient un tiret classique)
- `TEMPLATE_BISON.png` (Tout en majuscules)

## 📂 Structure du projet
- `templates/` : Le dossier de stockage contenant l'ensemble des images des coverings.
- `index.html`, `style.css`, `script.js` : Les fichiers frontend faisant tourner l'interface web.
- `fetch_discord.js`, `search_discord.js`, `cleanup.js` : Scripts utilitaires (Node.js) pour la gestion et l'automatisation.

---
*Ce dépôt est maintenu pour le bon fonctionnement et le développement de nos ressources FiveM.*
