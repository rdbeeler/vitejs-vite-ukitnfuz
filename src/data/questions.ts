export interface Question {
  id: number;
  unit: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index (0 = A, 1 = B, 2 = C, 3 = D)
  explanation: string;
}

export const questions: Question[] = [
  // --- UNIT 1: The Living World: Ecosystems ---
  {
    id: 1,
    unit: 1,
    topic: "1.1 Terrestrial Biomes",
    question: "Which terrestrial biome is characterized by low annual precipitation, nutrient-poor soil, and permafrost beneath the surface layer?",
    options: ["Taiga (Boreal Forest)", "Tundra", "Temperate Rainforest", "Desert"],
    correctAnswer: 1,
    explanation: "The tundra has a short growing season and permafrost (permanently frozen subsoil) that prevents deep root growth and slows decomposition, leaving soil nutrient-poor."
  },
  {
    id: 2,
    unit: 1,
    topic: "1.4 The Carbon Cycle",
    question: "Which of the following processes acts as the primary pathway for transferring carbon directly from the atmosphere into terrestrial biotic reservoirs?",
    options: ["Cellular Respiration", "Combustion", "Photosynthesis", "Decomposition"],
    correctAnswer: 2,
    explanation: "Photosynthesis converts atmospheric carbon dioxide into glucose, storing carbon in organic plant tissue."
  },
  {
    id: 3,
    unit: 1,
    topic: "1.5 The Nitrogen Cycle",
    question: "Which group of organisms is essential for converting atmospheric nitrogen gas (N2) into biological forms accessible to plants?",
    options: ["Mycorrhizal fungi", "Nitrosomonas and nitrogen-fixing bacteria", "Decomposers like earthworms", "Autotrophic algae"],
    correctAnswer: 1,
    explanation: "Nitrogen-fixing bacteria (such as Rhizobium in legume root nodules) convert unreactive N2 gas into ammonia (NH3/NH4+), making it biologically usable."
  },
  {
    id: 4,
    unit: 1,
    topic: "1.8 Primary Productivity",
    question: "If an ecosystem has a Gross Primary Productivity (GPP) of 20,000 kcal/m2/yr and autotrophs lose 12,000 kcal/m2/yr through cellular respiration (R), what is the Net Primary Productivity (NPP)?",
    options: ["32,000 kcal/m2/yr", "12,000 kcal/m2/yr", "8,000 kcal/m2/yr", "1.6 kcal/m2/yr"],
    correctAnswer: 2,
    explanation: "Net Primary Productivity is calculated using NPP = GPP - R. Substituting the values: 20,000 - 12,000 = 8,000 kcal/m2/yr."
  },

  // --- UNIT 2: The Living World: Biodiversity ---
  {
    id: 5,
    unit: 2,
    topic: "2.1 Introduction to Biodiversity",
    question: "Which component of biodiversity measures the relative abundance of individuals among the different species present in a community?",
    options: ["Species Richness", "Species Evenness", "Genetic Diversity", "Ecosystem Diversity"],
    correctAnswer: 1,
    explanation: "Species evenness describes how evenly individuals are distributed across species in an ecosystem, while species richness simply counts the total number of unique species."
  },
  {
    id: 6,
    unit: 2,
    topic: "2.3 Island Biogeography",
    question: "According to the theory of island biogeography, which type of island would be expected to support the highest species richness at equilibrium?",
    options: [
      "Small island far from the mainland",
      "Small island near the mainland",
      "Large island far from the mainland",
      "Large island near the mainland"
    ],
    correctAnswer: 3,
    explanation: "Large islands present bigger targets for migrating species (lower extinction rates), and proximity to the mainland increases immigration rates."
  },
  {
    id: 7,
    unit: 2,
    topic: "2.7 Ecological Succession",
    question: "Which of the following events would initiate primary ecological succession rather than secondary succession?",
    options: [
      "A severe forest fire that burns all vegetation",
      "The retreat of a glacier leaving exposed bare granite bedrock",
      "An abandoned agricultural field left fallow",
      "A major hurricane knocking down coastal trees"
    ],
    correctAnswer: 1,
    explanation: "Primary succession begins in areas without pre-existing soil (such as bare bedrock exposed by melting glaciers or cooled volcanic lava). Secondary succession occurs where soil remains after a disturbance."
  },

  // --- UNIT 3: Populations ---
  {
    id: 8,
    unit: 3,
    topic: "3.2 r- and K-Selected Species",
    question: "Which suite of biological traits is characteristic of a typical r-selected species?",
    options: [
      "High parental care, late reproduction, small offspring count",
      "Low parental care, rapid development, high reproductive capacity",
      "Long lifespan, high density-dependent mortality, large body size",
      "Stable population near carrying capacity, slow growth rate"
    ],
    correctAnswer: 1,
    explanation: "r-selected species focus on rapid reproduction: producing many small offspring with minimal parental investment to exploit unstable environments."
  },
  {
    id: 9,
    unit: 3,
    topic: "3.3 Survivorship Curves",
    question: "Humans and large mammals that exhibit low mortality rates during early and middle life followed by a sharp drop in survival in late life follow which survivorship curve?",
    options: ["Type I", "Type II", "Type III", "Type IV"],
    correctAnswer: 0,
    explanation: "Type I survivorship curves represent organisms with high parental investment that survive early life stages and experience mortality mostly in older age."
  },
  {
    id: 10,
    unit: 3,
    topic: "3.6 Age Structure Diagrams",
    question: "An age structure diagram (population pyramid) with a broad base tapering rapidly toward the top indicates a population that is:",
    options: [
      "Rapidly growing",
      "Stable or near zero growth",
      "Declining rapidly",
      "Experiencing a high proportion of elderly post-reproductive individuals"
    ],
    correctAnswer: 0,
    explanation: "A wide base means a high proportion of young, pre-reproductive individuals, indicating momentum for rapid future population growth."
  },
  {
    id: 11,
    unit: 3,
    topic: "3.8 Demographic Transition",
    question: "During Stage 2 (Industrializing/Transitional) of the Demographic Transition Model, what causes the rapid increase in overall population size?",
    options: [
      "Birth rates spike while death rates remain high",
      "Death rates fall rapidly due to improved sanitation/medicine while birth rates remain high",
      "Birth rates and death rates decline simultaneously",
      "Immigration increases dramatically while fertility rates drop below replacement level"
    ],
    correctAnswer: 1,
    explanation: "In Stage 2, access to clean water, food supply, and medical care drops death rates rapidly, but cultural norms keep birth rates high, causing a rapid population surge."
  }
];