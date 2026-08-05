export interface ProofStarterTemplate {
  id: string;
  persona: 'student' | 'freelance' | 'employee' | 'entrepreneur';
  personaLabel: string;
  badgeColor: string;
  title: string;
  category: string;
  description: string;
  beforePrompt: string;
  actionPrompt: string;
  resultPrompt: string;
  causalityPrompt: string;
  defaultSoftSkills: string[];
  suggestedValidationType: string;
  example: {
    before: string;
    action: string;
    result: string;
    causality: string;
  };
}

export const PROOF_STARTER_TEMPLATES: ProofStarterTemplate[] = [
  // --- ETUDIANT / JUNIOR ---
  {
    id: 'tmpl_student_project',
    persona: 'student',
    personaLabel: 'Étudiant & Junior',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    title: 'Projet Académique ou Travail Pratique',
    category: 'Projet d\'Études',
    description: 'Valorisez un projet de cours, un mémoire ou un cas d\'étude réalisé durant votre formation.',
    beforePrompt: 'Quel était le sujet ou le défi imposé au départ ? (ex: étude de cas, cahier des charges)',
    actionPrompt: 'Quelle démarche ou méthodologie avez-vous mise en œuvre pour réaliser ce projet ?',
    resultPrompt: 'Quel est le livrable final ou le résultat obtenu ? (ex: prototype, rapport valider, note)',
    causalityPrompt: 'Quelle compétence concrète ou apprentissage durable ce projet démontre-t-il ?',
    defaultSoftSkills: ['Esprit Critique', 'Communication', 'Créativité'],
    suggestedValidationType: 'Professeur / Tuteur académique',
    example: {
      before: 'Sujet d\'études sur la refonte ergonomique d\'une application mobile d\'apprentissage.',
      action: 'Réalisation d\'interviews utilisateurs auprès de 15 étudiants et prototypage Figma haute fidélité.',
      result: 'Prototype interactif testé et validé par le jury d\'évaluation avec la note de 18/20.',
      causality: 'Démontre une maîtrise de la méthodologie UX Research et de l\'écoute utilisateur.'
    }
  },
  {
    id: 'tmpl_student_internship',
    persona: 'student',
    personaLabel: 'Étudiant & Junior',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    title: 'Stage ou Alternance',
    category: 'Expérience Immersion',
    description: 'Transformez vos tâches de stage ou d\'alternance en une preuve d\'impact opérationnel.',
    beforePrompt: 'Quelle problématique de l\'entreprise vous a été confiée au début du stage ?',
    actionPrompt: 'Quelles actions spécifiques avez-vous menées durant votre mission ?',
    resultPrompt: 'Quel résultat concret avez-vous livré à l\'équipe ? (ex: tableau de bord, processus)',
    causalityPrompt: 'En quoi votre travail a-t-il aidé l\'équipe ou simplifié une tâche récurrente ?',
    defaultSoftSkills: ['Adaptabilité', 'Collaboration', 'Autonomie'],
    suggestedValidationType: 'Maître de stage / Manager',
    example: {
      before: 'Base de données prospects non structurée et saisies manuelles chronophages dans l\'équipe Sales.',
      action: 'Création d\'un template automatisé d\'import et rédaction d\'un guide d\'utilisation de 5 pages.',
      result: 'Nettoyage de 500+ fiches prospects et automatisation des rappels hebdomadaires.',
      causality: 'Gain de 3 heures par semaine pour les 4 commerciaux et élimination des doublons.'
    }
  },
  {
    id: 'tmpl_student_hackathon',
    persona: 'student',
    personaLabel: 'Étudiant & Junior',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    title: 'Hackathon / Projet Personnel',
    category: 'Projet Autonome',
    description: 'Mettez en avant une application, un prototype ou un défi relevé de manière autonome.',
    beforePrompt: 'Quel problème cherchiez-vous à résoudre ou quel défi avez-vous relevé ?',
    actionPrompt: 'Comment avez-vous construit le projet sous contrainte de temps ou de ressources ?',
    resultPrompt: 'Quel est l\'état actuel du projet ou sa démonstration publique ?',
    causalityPrompt: 'Que prouve cette initiative quant à votre capacité à passer de l\'idée à l\'action ?',
    defaultSoftSkills: ['Créativité', 'Gestion du Stress', 'Leadership'],
    suggestedValidationType: 'Mentors / Pairs / Organisateurs',
    example: {
      before: 'Défi Hackathon 48h : créer une solution pour réduire le gaspillage alimentaire local.',
      action: 'Développement complet d\'une PWA React/Node et intégration d\'une carte interactive.',
      result: 'Application fonctionnelle présentée devant un jury de 5 experts et 2ème prix décerné.',
      causality: 'Prouve la capacité d\'exécution rapide, l\'esprit d\'équipe sous pression et l\'autonomie.'
    }
  },

  // --- FREELANCE & CONSULTANT ---
  {
    id: 'tmpl_freelance_mission',
    persona: 'freelance',
    personaLabel: 'Freelance & Consultant',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    title: 'Mission Client & Livrable B2B',
    category: 'Prestation Client',
    description: 'Prouvez la valeur livrée lors d\'un mandat pour un client sans dévoiler de secrets d\'affaires.',
    beforePrompt: 'Quel était le problème business ou le goulot d\'étranglement chez votre client ?',
    actionPrompt: 'Quelle expertise ou solution sur mesure avez-vous déployée ?',
    resultPrompt: 'Quels sont les indicateurs clés de performance (KPI) ou livrables acceptés ?',
    causalityPrompt: 'Quel est le retour sur investissement (ROI) ou l\'impact direct pour le client ?',
    defaultSoftSkills: ['Esprit Critique', 'Leadership', 'Communication'],
    suggestedValidationType: 'Sponsor Client / Directeur de projet',
    example: {
      before: 'Taux de conversion sur le tunnel de vente client stagnant à 1.2% avec un temps de chargement élevé.',
      action: 'Audit de la performance web, refonte de l\'architecture front-end et optimisation UX.',
      result: 'Taux de conversion passé à 2.8% et temps de chargement divisé par 3 en 30 jours.',
      causality: 'Génération directe de +45k€ de chiffre d\'affaires additionnel sur le trimestre.'
    }
  },
  {
    id: 'tmpl_freelance_audit',
    persona: 'freelance',
    personaLabel: 'Freelance & Consultant',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    title: 'Audit & Refonte de Processus',
    category: 'Conseil & Stratégie',
    description: 'Mettez en valeur une mission de conseil, de diagnostic ou de transformation organisationnelle.',
    beforePrompt: 'Quelle inefficacité ou complexité avez-vous diagnostiquée au départ ?',
    actionPrompt: 'Quelles recommandations stratégiques et accompagnements avez-vous mis en place ?',
    resultPrompt: 'Quels changements opérationnels ont été adoptés par l\'organisation ?',
    causalityPrompt: 'Comment cette intervention a-t-elle sécurisé ou accéléré l\'activité du client ?',
    defaultSoftSkills: ['Leadership', 'Adaptabilité', 'Empathie'],
    suggestedValidationType: 'Directeur Général / Head of Ops',
    example: {
      before: 'Délais de validation interne de 14 jours entre la commande et la livraison de service.',
      action: 'Audit des flux de décision, suppression des étapes redondantes et formation des équipes.',
      result: 'Nouveau workflow adopté par les 3 pôles opérationnels en moins de 3 semaines.',
      causality: 'Délai moyen de validation réduit de 14 à 3 jours, améliorant la satisfaction client.'
    }
  },

  // --- SALARIE ---
  {
    id: 'tmpl_employee_improvement',
    persona: 'employee',
    personaLabel: 'Talent Salarié',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    title: 'Initiative & Amélioration Interne',
    category: 'Contribution d\'Équipe',
    description: 'Ancrez une réalisation interne qui a amélioré le quotidien de votre service ou entreprise.',
    beforePrompt: 'Quelle friction répétitive ou besoin non couvert observiez-vous dans votre quotidien ?',
    actionPrompt: 'Quelle initiative individuelle ou collective avez-vous prise pour y remédier ?',
    resultPrompt: 'Quel outil, documentation ou méthodologie est désormais utilisé au quotidien ?',
    causalityPrompt: 'En quoi cela a-t-il renforcé la productivité ou le bien-être de l\'équipe ?',
    defaultSoftSkills: ['Collaboration', 'Créativité', 'Autonomie'],
    suggestedValidationType: 'Manager direct / Lead Tech',
    example: {
      before: 'Manque de clarté sur la transmission des dossiers entre l\'équipe commerciale et l\'équipe support.',
      action: 'Création d\'une matrice d\'embarquement standardisée et tenue d\'ateliers mensuels d\'alignement.',
      result: 'Standardisation adoptée par 100% des collaborateurs du pôle relation client.',
      causality: 'Baisse de 40% des réclamations liées aux erreurs de transmission de dossier.'
    }
  },
  {
    id: 'tmpl_employee_incident',
    persona: 'employee',
    personaLabel: 'Talent Salarié',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    title: 'Résolution de Problème Critique',
    category: 'Gestion de Crise',
    description: 'Démontrez votre sang-froid et votre maîtrise technique/opérationnelle lors d\'un incident.',
    beforePrompt: 'Quel incident, dysfonctionnement majeur ou urgence est survenu(e) ?',
    actionPrompt: 'Comment avez-vous analysé la situation et coordonné la résolution d\'urgence ?',
    resultPrompt: 'En combien de temps la situation a-t-elle été stabilisée et sécurisée ?',
    causalityPrompt: 'Quelles mesures préventives avez-vous instaurées pour éviter toute récidive ?',
    defaultSoftSkills: ['Gestion du Stress', 'Esprit Critique', 'Leadership'],
    suggestedValidationType: 'Directeur Technique / CTO / COO',
    example: {
      before: 'Interruption inopinée de la plateforme de production impactant 2000 utilisateurs actifs.',
      action: 'Isolation du composant défaillant, restauration des sauvegardes et déploiement du correctif.',
      result: 'Service rétabli en 45 minutes sans aucune perte irrémédiable de données.',
      causality: 'Prouve la capacité à garder son calme sous très forte pression et à protéger l\'activité.'
    }
  },

  // --- ENTREPRENEUR & FOUNDER ---
  {
    id: 'tmpl_entrepreneur_mvp',
    persona: 'entrepreneur',
    personaLabel: 'Entrepreneur & Founder',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    title: 'Lancement de Produit / MVP',
    category: 'Création & Traction',
    description: 'Prouvez votre capacité à transformer une vision stratégique en une réalité marché.',
    beforePrompt: 'Quelle opportunité de marché ou besoin insatisfait cherchiez-vous à valider ?',
    actionPrompt: 'Comment avez-vous conçu, financé ou construit la première version opérationnelle ?',
    resultPrompt: 'Quels sont les premiers retours, utilisateurs enregistrés ou chiffres d\'affaires générés ?',
    causalityPrompt: 'Que démontre cette étape sur votre vision et votre frugalité d\'exécution ?',
    defaultSoftSkills: ['Leadership', 'Créativité', 'Adaptabilité'],
    suggestedValidationType: 'Associé / Investisseur / Client Pilote',
    example: {
      before: 'Absence de solution d\'évaluation transparente de la conformité pour les TPE locales.',
      action: 'Conception et lancement d\'une offre pilote auprès de 10 entreprises de la région.',
      result: '10 contrats pilotes signés et taux de satisfaction de 95% mesuré au bout de 2 mois.',
      causality: 'Démontre une capacité de validation rapide sur le terrain sans sur-investissement initial.'
    }
  }
];
