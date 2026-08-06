import os
import glob
import re

files_to_scan = sorted(glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True))

inventory = []
id_counter = 1

# Keywords for classification
tech_jargon_keywords = ['RIL', 'Reality Intelligence Layer', 'Graph', 'Proof Discovery', 'Bias Shield', 'Forge', 'hachage', 'hash', 'SHA256', 'Merkle', 'Solidity', 'JSON', 'PDF', 'API', 'SSOT', 'Token', 'Payload', 'WebSocket', 'Latency', 'ms']
certif_keywords = ['certifié', 'certifiée', 'certifiés', 'certifiées', 'certification', 'certifier']
confiance_keywords = ['Indice de Confiance', 'Réseau de Confiance', 'Niveau de Confiance']

for filepath in files_to_scan:
    rel_path = filepath.replace('\\', '/')
    filename = os.path.basename(filepath)
    component_name = filename.split('.')[0]

    # Skip pure technical utility/script files if they have zero UI strings, but scan everything first
    if 'src/scripts/' in rel_path or 'src/semantic-layer/' in rel_path or 'src/config/' in rel_path:
        continue

    # Determine Screen / Context
    if 'src/pages/Dashboard' in rel_path:
        screen = 'Tableau de bord Principal'
    elif 'src/pages/Projects' in rel_path:
        screen = 'Espaces de Travail & Projets'
    elif 'src/pages/Profile' in rel_path:
        screen = 'Profil & Passport Professionnel'
    elif 'src/pages/Network' in rel_path:
        screen = 'Cercle de Confiance / Réseau'
    elif 'src/pages/AdminDashboard' in rel_path:
        screen = 'Console de Supervision / Admin'
    elif 'src/pages/UserTestingMode' in rel_path:
        screen = 'Mode Évaluation / Bac à sable'
    elif 'src/pages/CreateProof' in rel_path:
        screen = 'Création & Déclaration de Preuve'
    elif 'src/pages/Opportunities' in rel_path:
        screen = 'Place de Marché / Opportunités'
    elif 'src/pages/RecruiterDashboard' in rel_path:
        screen = 'Espace Recruteur / Décideur'
    elif 'src/pages/Landing' in rel_path:
        screen = 'Page d\'accueil / Vitrine'
    elif 'src/pages/Onboarding' in rel_path:
        screen = 'Parcours d\'Accueil / Onboarding'
    elif 'src/components/intelligence/' in rel_path:
        screen = 'Composants Intelligence (RIL)'
    elif 'src/components/ui/' in rel_path:
        screen = 'Composants UI Atomiqes'
    elif 'src/components/Layout' in rel_path:
        screen = 'Layout Navigation & En-tête'
    elif 'src/content/' in rel_path:
        screen = 'Référentiel Contenu Copy'
    elif 'src/data/' in rel_path:
        screen = 'Modèles de Preuves & Data'
    else:
        screen = f'Composant {component_name}'

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for line_idx, line in enumerate(lines, 1):
        line_clean = line.strip()

        # Skip non-UI code
        if line_clean.startswith('import ') or line_clean.startswith('export type') or line_clean.startswith('interface ') or line_clean.startswith('//'):
            continue
        if line_clean.startswith('console.') or line_clean.startswith('const ') and ('className' in line_clean and not ('=' in line_clean and '"' in line_clean)):
            continue

        # Extract text snippets
        found_texts = []

        # JSX static text
        jsx_matches = re.findall(r'>\s*([^<>{}\n\t][^<>{}]*?)\s*<', line)
        for t in jsx_matches:
            t_str = t.strip()
            if t_str and not t_str.startswith('{') and len(t_str) > 1 and not t_str in ['/', ':', '-', '|', '•', '+', '—', '&', '()']:
                found_texts.append(('JSX Text', t_str))

        # String properties (title, label, placeholder, text, etc.)
        prop_matches = re.findall(r'''(?:title|label|placeholder|description|heading|subheading|text|name|comment|action|reason|role|validatorName|validatorRole|message|tooltip|header|subtitle|button|tab|badge)\s*:\s*["'`\n]([^"'`\n]{2,})["'`\n]''', line)
        for t in prop_matches:
            t_str = t.strip()
            if t_str and not t_str.startswith('text-') and not t_str.startswith('bg-') and not t_str.startswith('flex') and len(t_str) > 1:
                found_texts.append(('Prop/Literal', t_str))

        # Explicit placeholders
        ph_matches = re.findall(r'''placeholder\s*=\s*["'`\n]([^"'`\n]+)["'`\n]''', line)
        for t in ph_matches:
            found_texts.append(('Placeholder', t.strip()))

        # Alerts
        alert_matches = re.findall(r'''alert\s*\(\s*["'`\n]([^"'`\n]+)["'`\n]\s*\)''', line)
        for t in alert_matches:
            found_texts.append(('Alerte JS', t.strip()))

        for text_type, text_val in found_texts:
            # Classification
            category = 'Métier'
            status = 'OK'
            observation = 'Texte métier clair et conforme.'

            # Detect jargon or items to update
            if any(k in text_val for k in certif_keywords):
                status = 'A remplacer'
                category = 'Jargon'
                observation = "Remplacer 'certifié' par 'vérifié' ou 'validé' selon le contexte."
            elif 'RIL' in text_val or 'Reality Intelligence Layer' in text_val:
                status = 'A remplacer'
                category = 'Jargon'
                observation = "Remplacer par 'Assistant de Valorisation Professionnelle'."
            elif 'Graph' in text_val:
                status = 'A revoir'
                category = 'Jargon'
                observation = "Remplacer 'Graph' par 'Cercle de Confiance Professionnelle'."
            elif 'Réseau de Confiance' in text_val:
                status = 'A revoir'
                category = 'Ambigu'
                observation = "Harmoniser vers 'Cercle de Confiance Professionnelle'."
            elif 'Indice de Confiance' in text_val:
                status = 'A revoir'
                category = 'Ambigu'
                observation = "Harmoniser vers 'Niveau de Confiance Professionnelle'."
            elif any(k in text_val for k in ['SHA256', 'Merkle', 'Solidity', 'JSON', 'API', 'WebSocket', 'Latency', 'ms']):
                category = 'Technique'
                status = 'OK (Technique)'
                observation = "Terme technique réservé à l'audit ou aux métriques système."

            visibility = 'Haute' if screen in ['Tableau de bord Principal', 'Profil & Passport Professionnel', 'Cercle de Confiance / Réseau', 'Layout Navigation & En-tête', 'Création & Déclaration de Preuve'] else 'Moyenne'

            inventory.append({
                'id': id_counter,
                'file': rel_path,
                'component': component_name,
                'screen': screen,
                'line': line_idx,
                'location': f"Ligne {line_idx} ({text_type})",
                'text': text_val,
                'context': f"{screen} > {component_name}",
                'visibility': visibility,
                'category': category,
                'status': status,
                'observation': observation
            })
            id_counter += 1

print(f"Generated inventory of {len(inventory)} items.")
