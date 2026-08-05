export const terminologyMap = {
  leverageScore: {
    label: "Impact réel",
    description: "Mesure l'effet concret de vos actions sur votre environnement professionnel.",
    getLabel: (score: number) => {
      if (score > 4) return "Exceptionnel";
      if (score > 2.5) return "Très élevé";
      if (score > 1.5) return "Élevé";
      return "Modéré";
    }
  },
  verdict: {
    label: "Niveau de confiance",
    description: "Indice de fiabilité de vos réalisations basé sur des faits vérifiés.",
    getLabel: (verdict: string) => {
      switch (verdict.toLowerCase()) {
        case 'highly reliable': return "Très fiable";
        case 'reliable': return "Fiable";
        case 'highly_reliable': return "Très fiable";
        case 'unverified': return "À vérifier";
        default: return verdict;
      }
    }
  },
  proof: {
    label: "Réalisation vérifiable",
    plural: "Réalisations vérifiables"
  },
  signal: {
    label: "Crédibilité",
    description: "Votre présence professionnelle basée sur des faits."
  },
  match: {
    label: "Adéquation mission",
    description: "Analyse de la correspondance entre votre expérience et les besoins."
  },
  potentialGain: {
    label: "Impact potentiel",
    description: "Valeur ajoutée estimée pour votre prochaine mission."
  }
};

export const landingCopy = {
  hero: {
    title: "“Pendant des années, on m’a jugé sur mon CV. Aujourd'hui, on me juge sur ce que j’ai vraiment accompli.”",
    subtitle: "Laissez votre travail parler pour vous. Vos résultats. Vos preuves. En un coup d'œil, montrez exactement votre valeur réelle sur le terrain.",
    description: "Work Proof est l'outil de capture et de valorisation de vos réussites professionnelles réelles.",
    cta: "Créer mon profil"
  },
  chapters: [
    {
      id: 1,
      title: "Sortez de l'invisibilité opérationnelle",
      text: "Le CV traditionnel ne montre jamais ce que vous produisez réellement. Pendant que d’autres brillent par leurs mots, vos résultats concrets restent souvent dans l'ombre. Work Proof change la donne.",
      results: [
        "Fin des CV déclaratifs sans preuves",
        "Valorisation des talents du terrain",
        "Réductions des erreurs de casting",
        "Mise en lumière de l'impact réel"
      ]
    },
    {
      id: 2,
      title: "Vos preuves parlent enfin pour vous",
      text: "Chaque projet, action et impact devient une réalisation structurée. Transformez vos succès quotidiens en atouts majeurs pour votre carrière.",
      examples: [
        "Optimisation de 15 nouveaux hubs logistiques",
        "Réduction des coûts de transport de 20%",
        "Management d'équipes en situation critique"
      ],
      cta: "Découvrir la méthode"
    },
    {
      id: 3,
      title: "Capturez votre valeur au quotidien",
      text: "Une approche simple : Mission → Action → Résultat. Chaque étape est appuyée par une preuve (document, validation, lien) pour une crédibilité totale.",
      points: [
        "Capture facile de l'impact professionnel",
        "Validation par les pairs et les managers",
        "Infographies d'impact claires et immédiates"
      ]
    },
    {
      id: 4,
      title: "Soyez lisible en 5 secondes",
      text: "Le profil Work Proof est conçu pour une compréhension instantanée. Ne racontez plus votre parcours, montrez-le avec certitude.",
      cta: "Voir mon profil"
    },
    {
      id: 5,
      title: "Un réseau basé sur la confiance réelle",
      text: "En validant les preuves de vos collègues, vous renforcez l'écosystème. La crédibilité devient collective et vérifiée par ceux qui étaient sur le terrain avec vous.",
      cta: "Rejoindre le réseau"
    }
  ],
  comparison: {
    standard: {
      title: "Le Standard (CV / LinkedIn)",
      items: [
        "Déclarations sans preuves",
        "Compétences auto-proclamées",
        "Impact flou ou inexistant",
        "Storytelling souvent excessif"
      ]
    },
    workProof: {
      title: "Work Proof",
      items: [
        "Preuves de résultats concrets",
        "Impact réel et mesurable",
        "Signaux de confiance immédiats",
        "Zéro blabla. 100% Réalisé."
      ]
    }
  },
  manifesto: {
    title: "Le marché ne recrute plus des profils. Il recrute des transformations.",
    description: "Dans un monde saturé de promesses, la seule devise qui a de la valeur est la preuve de ce que vous avez réellement accompli sur le terrain.",
    points: [
      "Le storytelling est une illusion, le résultat est une réalité.",
      "Votre valeur réside dans ce que vous transformez.",
      "La décision de recrutement doit être basée sur des faits."
    ]
  },
  pillars: [
    {
      title: "Confiance",
      description: "Un signal clair de fiabilité basé sur l'ancrage de vos réalisations passées."
    },
    {
      title: "Impact",
      description: "Quelle valeur créez-vous ? La mesure concrète de votre capacité à transformer une situation."
    },
    {
      title: "Réalisations",
      description: "Qu'avez-vous fait ? Accès direct à vos succès les plus marquants."
    }
  ]
};

export const onboardingCopy = {
  steps: [
    {
      title: "Identité Professionnelle",
      description: "Posons les bases de votre présence sur le terrain."
    },
    {
      title: "Comprendre votre Impact",
      description: "Découvrez comment vos preuves valorisent votre profil."
    },
    {
      title: "Vos Forces Réelles",
      description: "Quelles compétences avez-vous prouvées par l'action ?"
    },
    {
      title: "Votre Plus Belle Réussite",
      description: "Partagez une réalisation concrète et ses résultats."
    },
    {
      title: "Profil Activé",
      description: "Votre valeur est maintenant visible et vérifiable."
    }
  ]
};

export const dashboardCopy = {
  sections: {
    actions: "Prochaines étapes",
    impact: "Impact mesuré",
    realizations: "Réalisations récentes",
    opportunities: "Opportunités",
    trust: "Confiance & Validation"
  },
  insights: {
    leverage: "Votre impact est actuellement {label}. En ajoutant une preuve sur '{skill}', vous pourriez valoriser davantage votre expertise."
  }
};

export const opportunitiesCopy = {
  header: {
    title: "Opportunités de",
    highlight: "Carrière",
    description: "Le marché cherche des experts capables de produire des résultats. Trouvez votre prochain défi basé sur votre impact réel."
  },
  stats: {
    verified: "Succès confirmés",
    arbitration: "En attente",
    confidence: "Indice de confiance"
  },
  search: {
    title: "Trouvez votre",
    highlight: "Prochaine Mission",
    description: "Notre système analyse vos réalisations pour vous proposer des missions où votre valeur sera immédiatement reconnue.",
    placeholder: "Rechercher par métier ou compétence..."
  },
  sections: {
    market: "Missions disponibles",
    history: "Historique"
  },
  table: {
    company: "Entreprise",
    role: "Mission",
    confidence: "Fiabilité",
    status: "Statut",
    actions: "Actions"
  },
  status: {
    hired: "Engagement",
    rejected: "Non retenu",
    pending: "En cours"
  }
};

export const profileCopy = {
  sections: {
    achievements: "Journal des preuves",
    impactAnalysis: "Analyse d'impact",
    topAchievements: "Succès majeurs",
    keyContributions: "Actions & Résultats",
    contributionLedger: "Historique vérifié",
    resultsHistory: "Parcours de résultats",
    credibilityJournal: "Journal de confiance"
  }
};
