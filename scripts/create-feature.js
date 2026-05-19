import fs from 'fs';
import path from 'path';
import { stdin as input, stdout as output } from 'process';
import readline from 'readline/promises';
import { fileURLToPath } from 'url';

// Recréer __dirname qui n'existe pas nativement dans les ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste des sous-dossiers génériques
const SUB_DIRECTORIES = ['hooks', 'contexts', 'screens', 'components', 'services', 'utils'];

async function generateFeature() {
  const rl = readline.createInterface({ input, output });

  try {
    const featureName = await rl.question('Nom de la feature à créer (ex: authentication) : ');

    if (!featureName.trim()) {
      console.error('❌ Erreur : Le nom de la feature ne peut pas être vide.');
      process.exit(1);
    }

    // Nettoyage du nom (minuscules, pas d'espaces)
    const formattedName = featureName.trim().toLowerCase().replace(/\s+/g, '-');

    // Chemin cible : src/features/nom-de-la-feature
    const featurePath = path.join(__dirname, '..', 'src', 'features', formattedName);

    if (fs.existsSync(featurePath)) {
      console.error(
        `❌ Erreur : La feature "${formattedName}" existe déjà à l'adresse : ${featurePath}`,
      );
      process.exit(1);
    }

    // 1. Créer le dossier principal de la feature
    fs.mkdirSync(featurePath, { recursive: true });
    console.log(`\n📁 Dossier principal créé : src/features/${formattedName}`);

    // 2. Créer les sous-dossiers
    SUB_DIRECTORIES.forEach(subDir => {
      const subDirPath = path.join(featurePath, subDir);
      fs.mkdirSync(subDirPath);

      // Crée un fichier .gitkeep pour que Git suive les dossiers même s'ils sont vides
      // fs.writeFileSync(path.join(subDirPath, '.gitkeep'), '');
    });

    // 3. Créer un fichier d'index pour des exports propres
    fs.writeFileSync(
      path.join(featurePath, 'index.ts'),
      `// Export de la feature ${formattedName}\n`,
    );

    console.log(`\n✨ Feature "${formattedName}" créée avec succès ! 🚀`);
  } catch (error) {
    console.error(`❌ Une erreur est survenue lors de la création :`, error);
  } finally {
    rl.close();
  }
}

generateFeature();
