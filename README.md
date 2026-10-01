# Portfolio

Portfolio : une seule page, bilingue (français et anglais), avec une
ambiance rétro chaleureuse, une scène 3D, une musique d'ambiance générée en direct et un splash
screen animé.

> **Licence : tous droits réservés.** Ce dépôt est public pour être lu et évalué, pas pour être
> copié. Voir la section [Licence](#licence) et le fichier [`LICENSE`](./LICENSE).

English: single-page bilingual (FR/EN) developer portfolio built with React, TypeScript, Vite,
Three.js and Motion, statically pre-rendered for SEO. Source-available under an all-rights-reserved
license (see `LICENSE`).

## Sommaire


- [Stack](#stack)
- [Démarrage](#démarrage)
- [Scripts](#scripts)
- [Structure du projet](#structure-du-projet)
- [Modifier le contenu](#modifier-le-contenu)
- [Comment ça marche](#comment-ça-marche)
- [Performance et accessibilité](#performance-et-accessibilité)
- [Licence](#licence)
- [Crédits](#crédits)


## Stack

| Rôle | Outil |
|---|---|
| Interface | React 19, TypeScript (mode strict) |
| Build | Vite, pré-rendu statique maison (`scripts/prerender.mjs`) |
| Animations | Motion |
| 3D | Three.js avec `@react-three/fiber` |
| Icônes | Tabler Icons |
| Polices | Fredoka (titres) et DM Sans (texte), installées avec Fontsource |
| Style | CSS pur (une feuille, variables CSS), sans framework CSS |
| Qualité | ESLint (règles React Hooks et React Refresh) |

Un seul morceau de Mantine est utilisé (`@mantine/hooks`, pour la détection d'écran et le presse-papiers).

## Démarrage

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Le site est alors disponible sur `http://localhost:5173/` (redirigé vers `/fr` ou `/en`).

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement avec rechargement à chaud. |
| `npm run build` | Vérifie les types, construit le site, construit le rendu serveur, puis génère les pages statiques `dist/fr/`, `dist/en/` et la racine `dist/`. |
| `npm run preview` | Sert le dossier `dist/` pour tester la version de production. |
| `npm run lint` | Lance ESLint. |

Pour mesurer les performances (Lighthouse), utilisez toujours la version de production
(`npm run build` puis `npm run preview`) : le serveur de développement ne regroupe pas les fichiers
et donne des scores très inférieurs.

## Structure du projet

```
index.html             Modèle de page : thème, splash et métadonnées initiales
public/                Favicon, robots.txt, captures des projets (public/projects/)
scripts/prerender.mjs  Génère les pages statiques après le build
src/
  main.tsx             Point d'entrée client (hydratation ou rendu)
  entry-server.tsx     Point d'entrée du pré-rendu
  App.tsx              Applique le thème et affiche le site
  content/profile.ts   Liens, projets (stack, URLs, captures) et étiquettes de compétences
  i18n/                Textes français et anglais, fournisseur de langue
  hooks/               Thème, inactivité, capacités de l'appareil, démarrage différé
  site/
    Site.tsx           Assemble la page
    Scene.tsx          Scène 3D
    SleepOverlay.tsx   Easter egg d'inactivité
    site.css           Feuille de style unique
    components/        Navigation, logo, splash, pied de page, apparition au scroll
    sections/          Une section = un fichier
    music/             Lecteur et moteur de synthèse lo-fi
```

## Modifier le contenu

- **Textes** : `src/i18n/fr.ts` et `src/i18n/en.ts` (mêmes clés, typées par `src/i18n/types.ts` : le
  compilateur signale toute clé manquante dans l'une des langues).
- **Projets, liens, étiquettes de compétences** : `src/content/profile.ts`. Pour ajouter une capture,
  déposez l'image dans `public/projects/` et renseignez le champ `image` du projet.
- **E-mail affiché** : constante `EMAIL` dans `src/content/profile.ts`.
- **Couleurs et styles** : variables CSS en haut de `src/site/site.css`.
- **Domaine des pages** : constante `SITE` dans `scripts/prerender.mjs` (liens canoniques et `hreflang`).

## Comment ça marche

### Pré-rendu et hydratation

`npm run build` produit trois choses : le site client (`dist/`), un bundle serveur temporaire
(`dist-server/`) et les pages statiques. `scripts/prerender.mjs` rend l'application avec
`renderToString` pour chaque langue et écrit `dist/fr/index.html` et `dist/en/index.html` avec le
contenu complet, les balises `title`, `description`, `canonical` et `hreflang`. Le navigateur
hydrate ensuite ces pages. La racine `dist/index.html` est une petite page qui redirige vers `/fr/`
ou `/en/` selon la langue du navigateur.

Pour que le rendu serveur et le rendu client restent identiques, tout ce qui dépend du navigateur
(thème, WebGL, taille d'écran) est lu dans des effets ou des `useSyncExternalStore`, jamais
pendant le premier rendu.

### Performance de la 3D

La scène 3D pèse environ 245 Ko compressés. Elle est chargée en différé, après le chargement de la
page et à la première interaction (ou après 5 secondes). En attendant, une image CSS reproduit les
mêmes formes au même endroit, puis la 3D prend le relais en fondu. La 3D est désactivée en mode
« réduire les animations » et sur les appareils tactiles peu puissants.
*Made with AI*

### Musique

Le lecteur utilise l'API Web Audio : accords, basse, batterie, mélodie et bruit de vinyle sont
synthétisés en direct (`src/site/music/lofi.ts`). Aucun fichier audio n'est chargé, donc aucun droit
d'auteur musical à gérer. Le moteur n'est téléchargé qu'au premier clic.
*Made with AI*

### Splash screen

La séquence est écrite avec `animate()` de Motion (`src/site/components/Splash.tsx`). Un petit
script dans `index.html` décide de l'afficher : une fois par onglet, jamais avec « réduire les
animations ». L'attribut `data-splash` de `<html>` pilote les états (`skip`, `landed`, `done`).
*Made with AI*


## Performance et accessibilité

Mesures Lighthouse mobile sur la version de production : performance 95 à 97, accessibilité 100,
bonnes pratiques 100, SEO 100. Parmi les choix : navigation clavier complète, focus visible,
contrastes AA pour le texte courant, respect de `prefers-reduced-motion` et de
`prefers-color-scheme`, textes alternatifs, et une page lisible sans JavaScript.

## Licence

Ce dépôt est **visible publiquement mais n'est pas open source**. Le code, le design, les animations,
le logo et les contenus sont protégés : **tous droits réservés**.

En résumé :

- Vous pouvez **lire** le code, le **cloner** pour l'étudier ou l'évaluer, et en citer de courts
  extraits avec un lien vers ce dépôt.
- Vous ne pouvez pas **copier, déployer ou republier** ce site, ni créer une version dérivée (même en
  remplaçant simplement les noms, textes, images ou couleurs), ni réutiliser son identité visuelle,
  ni l'utiliser pour entraîner des modèles d'IA.
- Pour toute autre utilisation, une autorisation écrite préalable est nécessaire.

Le texte complet, qui fait foi, est dans [`LICENSE`](./LICENSE). Les dépendances tierces restent
sous leurs propres licences.

## Crédits

- [React](https://react.dev), [Vite](https://vite.dev), [Three.js](https://threejs.org),
  [react-three-fiber](https://r3f.docs.pmnd.rs), [Motion](https://motion.dev)
- [Tabler Icons](https://tabler.io/icons) (licence MIT)
- Polices [Fredoka](https://fonts.google.com/specimen/Fredoka) et
  [DM Sans](https://fonts.google.com/specimen/DM+Sans) (licence SIL Open Font License), installées
  avec [Fontsource](https://fontsource.org)
