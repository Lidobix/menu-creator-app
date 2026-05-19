# Projet React Native

## Stack technique

- **Framework** : React Native avec Expo (Managed Workflow)
- **Langage** : TypeScript (strict)
- **Gestionnaire de paquets** : npm
- **State management** : Zustand + persist (AsyncStorage)
- **Navigation** : Expo Router

## Skills

Applique systématiquement les best practices définies dans la skill globale `vercel-react-native-skills`
(installée dans `~/.claude/skills/`).

## Commandes essentielles

```bash
npm install                        # Installer les dépendances
npm start                          # Lancer Expo (Metro bundler)
npm run android                    # Lancer sur émulateur Android
npm run ios                        # Lancer sur simulateur iOS
npm run web                        # Lancer dans le navigateur
npx expo lint                      # Vérifier le code
npx tsc --noEmit                   # Vérifier les types TypeScript
node scripts/create-feature.mjs    # Générer une nouvelle feature
```

## Structure du projet

app/ # Routing uniquement (Expo Router) — aucune logique métier ici
(tabs)/ # Onglets principaux
create/ # Stack de création (wizard)
features/ # Modules métier autonomes — c'est ici que vit le code
ingredients/ # CRUD ingrédients (owner du store)
menus/ # Affichage des menus sauvegardés
create-pizza/ # Wizard de création (3 étapes)
src/ # Briques génériques sans logique métier
components/ # Composants UI réutilisables (Button, Text, Card…)
hooks/ # Hooks d'infrastructure (useTheme, useColorScheme…)
utils/ # Helpers purs (dates, formatters…)
constants/ # Couleurs, dimensions, config globale
types/ # Types partagés entre plusieurs features
assets/ # Images, fonts, icônes
scripts/ # Scripts de développement (create-feature.mjs…)

## Architecture features — règles impératives

- **Toute logique métier va dans `features/`**, jamais directement dans `app/`
- Chaque feature expose uniquement ce qui est dans son `index.ts` — importer un chemin interne est interdit

```ts
// ✅
import { IngredientsScreen } from '@/features/ingredients';
// ❌
import { IngredientItem } from '@/features/ingredients/components/IngredientItem';
```

- Une feature peut **lire** le store d'une autre feature, jamais **écrire** dedans
- L'état temporaire d'un wizard (multi-étapes) vit dans un **Context local** à la feature, pas dans un store global
- L'état persistant partagé vit dans un **store Zustand** avec `persist` + AsyncStorage, dans la feature qui en est owner
- Si deux features doivent _modifier_ la même donnée → remonter le store dans `src/`

## Anatomie d'une feature

features/ma-feature/
screens/ # Composants écran (consomment les hooks)
components/ # UI locale à la feature
hooks/ # Logique UI — seul accès autorisé au store depuis les screens
store/ # Zustand store (si donnée persistante)
context/ # React Context (si état temporaire / wizard)
api/ # Appels réseau ou AsyncStorage
utils/ # Helpers spécifiques à la feature
tests/ # Tests Jest / React Native Testing Library
types.ts # Types & interfaces de la feature
constants.ts # Constantes locales
index.ts # 🚪 Seul point d'entrée public

## Conventions de code

- Toujours utiliser **TypeScript strict** — pas de `any` sauf cas exceptionnel justifié
- Composants **fonctionnels uniquement** (pas de class components)
- Utiliser `async/await`, jamais `.then()` brut
- **Exports nommés** de préférence aux exports par défaut
- Un composant par fichier
- Les screens dans `app/` sont des wrappers minces — max ~15 lignes

## Règles importantes

- Ne **jamais** modifier `app.json` / `app.config.ts` sans le signaler
- Ne **pas** installer de librairies natives incompatibles avec Expo Managed
- Toujours vérifier la compatibilité Expo avant d'ajouter une dépendance : https://docs.expo.dev/versions/latest/
- Préférer les packages Expo (`expo-camera`, `expo-location`, etc.) aux alternatives bare quand disponibles
- Lancer `npx tsc --noEmit` avant de considérer une tâche terminée

## À ne pas toucher

- `node_modules/`
- `.expo/`
- Fichiers générés automatiquement par Expo
