import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  FileText,
  CheckCircle,
  XCircle,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BarChart2,
} from 'lucide-react';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Question {
  id: string;
  unitId: number;
  topicId: string;
  questionText: string;
  options: Option[];
}

interface FRQPrompt {
  id: string;
  question: string;
  rubric: string;
}

interface FRQQuestion {
  id: string;
  unitId: number;
  title: string;
  scenario: string;
  prompts: FRQPrompt[];
}

// ==========================================
// DATA BANKS
// ==========================================
const APES_UNITS = [
  { id: 1, name: 'Unit 1: The Living World: Ecosystems', weight: '6-8%' },
  { id: 2, name: 'Unit 2: The Living World: Biodiversity', weight: '6-8%' },
  { id: 3, name: 'Unit 3: Populations', weight: '10-15%' },
  { id: 4, name: 'Unit 4: Earth Systems and Resources', weight: '10-15%' },
  { id: 5, name: 'Unit 5: Land and Water Use', weight: '10-15%' },
  { id: 6, name: 'Unit 6: Energy Resources and Consumption', weight: '10-15%' },
  { id: 7, name: 'Unit 7: Atmospheric Pollution', weight: '7-10%' },
  { id: 8, name: 'Unit 8: Aquatic and Terrestrial Pollution', weight: '7-10%' },
  { id: 9, name: 'Unit 9: Global Change', weight: '15-20%' },
];

const QUESTIONS: Question[] = [
  // ================= UNIT 1 =================
  {
    id: 'u1_q1',
    unitId: 1,
    topicId: '1.4',
    questionText:
      'Which process in the carbon cycle removes carbon dioxide directly from the atmosphere and converts it into organic glucose?',
    options: [
      {
        id: 'A',
        text: 'Cellular Respiration',
        isCorrect: false,
        explanation:
          'Respiration burns glucose and releases CO2 back into the atmosphere.',
      },
      {
        id: 'B',
        text: 'Photosynthesis',
        isCorrect: true,
        explanation:
          'Autotrophs fix atmospheric CO2 into organic glucose during photosynthesis.',
      },
      {
        id: 'C',
        text: 'Combustion',
        isCorrect: false,
        explanation: 'Combustion releases stored carbon into the atmosphere.',
      },
      {
        id: 'D',
        text: 'Nitrogen Fixation',
        isCorrect: false,
        explanation: 'Nitrogen fixation converts N2 gas into ammonia.',
      },
    ],
  },
  {
    id: 'u1_q2',
    unitId: 1,
    topicId: '1.8',
    questionText:
      'According to the 10% rule of energy transfer in an ecosystem, if a producer level contains 10,000 kcal of energy, approximately how much energy is available to secondary consumers?',
    options: [
      {
        id: 'A',
        text: '1,000 kcal',
        isCorrect: false,
        explanation:
          '1,000 kcal is transferred to primary consumers (10% of 10,000).',
      },
      {
        id: 'B',
        text: '100 kcal',
        isCorrect: true,
        explanation:
          'Primary consumers receive 1,000 kcal (10%), and secondary consumers receive 100 kcal (10% of 1,000).',
      },
      {
        id: 'C',
        text: '10 kcal',
        isCorrect: false,
        explanation: '10 kcal would reach tertiary consumers.',
      },
      {
        id: 'D',
        text: '10,000 kcal',
        isCorrect: false,
        explanation:
          'Energy decreases at each trophic level due to metabolic heat loss.',
      },
    ],
  },
  {
    id: 'u1_q3',
    unitId: 1,
    topicId: '1.5',
    questionText:
      'Which terrestrial biome is characterized by permafrost, low biodiversity, and short growing seasons?',
    options: [
      {
        id: 'A',
        text: 'Taiga (Boreal Forest)',
        isCorrect: false,
        explanation:
          'Taiga has cold winters but lacks true continuous permafrost soils found in tundra.',
      },
      {
        id: 'B',
        text: 'Tundra',
        isCorrect: true,
        explanation:
          'Tundra has a permanently frozen subsoil layer (permafrost) limiting deep root growth.',
      },
      {
        id: 'C',
        text: 'Temperate Rainforest',
        isCorrect: false,
        explanation:
          'Temperate rainforests feature high rainfall and tall evergreen trees.',
      },
      {
        id: 'D',
        text: 'Savanna',
        isCorrect: false,
        explanation:
          'Savannas are tropical grasslands with distinct wet and dry seasons.',
      },
    ],
  },

  // ================= UNIT 2 =================
  {
    id: 'u2_q1',
    unitId: 2,
    topicId: '2.1',
    questionText:
      'Which ecosystem service category includes crop pollination by wild bees and water filtration by wetlands?',
    options: [
      {
        id: 'A',
        text: 'Provisioning Services',
        isCorrect: false,
        explanation:
          'Provisioning refers to physical goods extracted from ecosystems (e.g., timber, freshwater).',
      },
      {
        id: 'B',
        text: 'Regulating Services',
        isCorrect: true,
        explanation:
          'Regulating services govern natural processes like climate control, pollination, and filtration.',
      },
      {
        id: 'C',
        text: 'Cultural Services',
        isCorrect: false,
        explanation:
          'Cultural services provide non-material aesthetic, spiritual, or recreational value.',
      },
      {
        id: 'D',
        text: 'Supporting Services',
        isCorrect: false,
        explanation:
          'Supporting services are foundational natural processes like photosynthesis and soil formation.',
      },
    ],
  },
  {
    id: 'u2_q2',
    unitId: 2,
    topicId: '2.3',
    questionText:
      'According to the Theory of Island Biogeography, which island profile will support the highest species richness?',
    options: [
      {
        id: 'A',
        text: 'Small island far from the mainland',
        isCorrect: false,
        explanation:
          'Small, far islands have low immigration rates and high extinction rates.',
      },
      {
        id: 'B',
        text: 'Large island close to the mainland',
        isCorrect: true,
        explanation:
          'Large size provides more habitats (lower extinction) and proximity increases immigration rates.',
      },
      {
        id: 'C',
        text: 'Small island close to the mainland',
        isCorrect: false,
        explanation:
          'Small size limits total species capacity due to high competition.',
      },
      {
        id: 'D',
        text: 'Large island far from the mainland',
        isCorrect: false,
        explanation:
          'Distance reduces immigration, lowering total richness compared to near islands.',
      },
    ],
  },
  {
    id: 'u2_q3',
    unitId: 2,
    topicId: '2.7',
    questionText:
      'Which event would initiate primary ecological succession rather than secondary succession?',
    options: [
      {
        id: 'A',
        text: 'A severe forest fire destroying timber',
        isCorrect: false,
        explanation:
          'Forest fires leave existing soil intact, leading to secondary succession.',
      },
      {
        id: 'B',
        text: 'Abandonment of an agricultural pasture',
        isCorrect: false,
        explanation:
          'Abandoned cropland retains topsoil, so it undergoes secondary succession.',
      },
      {
        id: 'C',
        text: 'Cooling of lava from a volcanic eruption',
        isCorrect: true,
        explanation:
          'Volcanic lava creates brand new bare rock with no pre-existing soil.',
      },
      {
        id: 'D',
        text: 'A hurricane destroying a coastal mangrove forest',
        isCorrect: false,
        explanation: 'Soil and seed banks remain intact after storm damage.',
      },
    ],
  },

  // ================= UNIT 3 =================
  {
    id: 'u3_q1',
    unitId: 3,
    topicId: '3.3',
    questionText:
      'Which of the following characteristics is typically associated with r-selected species?',
    options: [
      {
        id: 'A',
        text: 'High levels of parental care',
        isCorrect: false,
        explanation:
          'Parental care is a signature trait of K-selected species.',
      },
      {
        id: 'B',
        text: 'Long lifespans and slow population growth',
        isCorrect: false,
        explanation:
          'r-selected species typically have short lifespans and rapid reproduction.',
      },
      {
        id: 'C',
        text: 'Numerous, small offspring',
        isCorrect: true,
        explanation:
          'r-selected species invest energy in producing large numbers of offspring quickly.',
      },
      {
        id: 'D',
        text: 'Strong competitive ability in stable ecosystems',
        isCorrect: false,
        explanation:
          'r-selected species are opportunistic colonizers rather than late-succession competitors.',
      },
    ],
  },
  {
    id: 'u3_q2',
    unitId: 3,
    topicId: '3.6',
    questionText:
      'An age-structure diagram with a very wide base that tapers rapidly toward the top represents a population that is:',
    options: [
      {
        id: 'A',
        text: 'Declining rapidly',
        isCorrect: false,
        explanation:
          'Declining populations have a narrow base compared to reproductive age cohorts.',
      },
      {
        id: 'B',
        text: 'Experiencing rapid growth',
        isCorrect: true,
        explanation:
          'A wide base indicates a large proportion of pre-reproductive youth driving future growth.',
      },
      {
        id: 'C',
        text: 'Stable and unchanging',
        isCorrect: false,
        explanation:
          'Stable populations have roughly vertical, column-like sides.',
      },
      {
        id: 'D',
        text: 'At zero population growth (ZPG)',
        isCorrect: false,
        explanation:
          'Zero growth yields a rectangular or column-shaped pyramid.',
      },
    ],
  },

  // ================= UNIT 4 =================
  {
    id: 'u4_q1',
    unitId: 4,
    topicId: '4.1',
    questionText:
      'At which type of plate boundary does seafloor spreading occur, creating new oceanic crust?',
    options: [
      {
        id: 'A',
        text: 'Convergent boundary',
        isCorrect: false,
        explanation:
          'Convergent boundaries destroy crust or build mountain ranges through collision.',
      },
      {
        id: 'B',
        text: 'Divergent boundary',
        isCorrect: true,
        explanation:
          'Tectonic plates move apart at divergent boundaries, allowing magma to rise and cool as ocean ridge crust.',
      },
      {
        id: 'C',
        text: 'Transform boundary',
        isCorrect: false,
        explanation:
          'Transform boundaries slide laterally past each other without creating or destroying crust.',
      },
      {
        id: 'D',
        text: 'Subduction zone',
        isCorrect: false,
        explanation: 'Subduction zones pull older crust down into the mantle.',
      },
    ],
  },
  {
    id: 'u4_q2',
    unitId: 4,
    topicId: '4.8',
    questionText:
      'During an El Niño event, what atmospheric and ocean changes occur in the tropical Pacific Ocean?',
    options: [
      {
        id: 'A',
        text: 'Trade winds strengthen, increasing upwelling off South America',
        isCorrect: false,
        explanation:
          'Strengthened trade winds and enhanced upwelling describe La Niña.',
      },
      {
        id: 'B',
        text: 'Trade winds weaken, suppressed upwelling warms South American coastal waters',
        isCorrect: true,
        explanation:
          'El Niño weakens trade winds, reducing cold nutrient-rich upwelling off Peru.',
      },
      {
        id: 'C',
        text: 'Sea surface temperatures drop drastically across the equatorial Pacific',
        isCorrect: false,
        explanation:
          'El Niño brings unusually warm ocean surface waters to the central/eastern Pacific.',
      },
      {
        id: 'D',
        text: 'Monsoons in Southeast Asia intensify significantly',
        isCorrect: false,
        explanation:
          'El Niño typically brings droughts to Australia and Indonesia.',
      },
    ],
  },

  // ================= UNIT 5 =================
  {
    id: 'u5_q1',
    unitId: 5,
    topicId: '5.1',
    questionText:
      'Which scenario best exemplifies the concept of the "Tragedy of the Commons"?',
    options: [
      {
        id: 'A',
        text: 'A farmer over-applying fertilizer on their privately owned cornfield',
        isCorrect: false,
        explanation:
          'Private land ownership provides direct economic incentives to preserve land value.',
      },
      {
        id: 'B',
        text: 'Multiple commercial fishing fleets depleting unregulated international ocean waters',
        isCorrect: true,
        explanation:
          'Shared, unregulated public resources (commons) suffer from individual overexploitation.',
      },
      {
        id: 'C',
        text: 'A city government charging tolls to reduce highway traffic congestion',
        isCorrect: false,
        explanation:
          'Tolls regulate access to public goods to prevent overuse.',
      },
      {
        id: 'D',
        text: 'A national park charging entrance fees to fund trail repairs',
        isCorrect: false,
        explanation:
          'Public management fees maintain common resources rather than exploiting them.',
      },
    ],
  },
  {
    id: 'u5_q2',
    unitId: 5,
    topicId: '5.5',
    questionText:
      'Which irrigation technique is the MOST water-efficient, reducing evaporative loss by delivering water directly to roots?',
    options: [
      {
        id: 'A',
        text: 'Flood irrigation',
        isCorrect: false,
        explanation:
          'Flood irrigation loses ~30-40% of water to evaporation and runoff.',
      },
      {
        id: 'B',
        text: 'Furrow irrigation',
        isCorrect: false,
        explanation:
          'Furrow irrigation floods channels between crops, leading to evaporation losses.',
      },
      {
        id: 'C',
        text: 'Drip irrigation',
        isCorrect: true,
        explanation:
          'Drip systems deliver precise moisture directly to plant roots with over 90% efficiency.',
      },
      {
        id: 'D',
        text: 'Spray irrigation',
        isCorrect: false,
        explanation:
          'Sprinklers spray water into the air, losing moisture to wind and evaporation.',
      },
    ],
  },

  // ================= UNIT 6 =================
  {
    id: 'u6_q1',
    unitId: 6,
    topicId: '6.6',
    questionText:
      'In a nuclear power plant, what is the primary function of control rods in the reactor core?',
    options: [
      {
        id: 'A',
        text: 'To condense steam back into liquid water',
        isCorrect: false,
        explanation:
          'Cooling towers or condensers return steam back into liquid water.',
      },
      {
        id: 'B',
        text: 'To absorb excess neutrons and regulate the fission chain reaction',
        isCorrect: true,
        explanation:
          'Control rods absorb neutrons to prevent overheating or runaway reactions.',
      },
      {
        id: 'C',
        text: 'To enrich Uranium-235 ore into nuclear fuel rods',
        isCorrect: false,
        explanation:
          'Enrichment takes place before fuel fabrication at specialized facilities.',
      },
      {
        id: 'D',
        text: 'To generate electricity directly via magnetohydrodynamics',
        isCorrect: false,
        explanation:
          'Heat from fission boils water into steam to turn a mechanical turbine.',
      },
    ],
  },
  {
    id: 'u6_q2',
    unitId: 6,
    topicId: '6.3',
    questionText:
      'Which fossil fuel burns the cleanest, producing the lowest amount of carbon dioxide per unit of energy released?',
    options: [
      {
        id: 'A',
        text: 'Anthracite coal',
        isCorrect: false,
        explanation: 'Coal produces the highest CO2 emissions per energy unit.',
      },
      {
        id: 'B',
        text: 'Crude petroleum',
        isCorrect: false,
        explanation:
          'Oil produces significantly higher CO2 and NOx than natural gas.',
      },
      {
        id: 'C',
        text: 'Natural gas (Methane)',
        isCorrect: true,
        explanation:
          'Natural gas burns more completely, producing ~40-50% less CO2 than coal.',
      },
      {
        id: 'D',
        text: 'Bituminous coal',
        isCorrect: false,
        explanation: 'Bituminous coal contains high sulfur and carbon content.',
      },
    ],
  },

  // ================= UNIT 7 =================
  {
    id: 'u7_q1',
    unitId: 7,
    topicId: '7.2',
    questionText:
      'Which environmental conditions promote the formation of photochemical smog in urban areas?',
    options: [
      {
        id: 'A',
        text: 'Low temperatures, overcast skies, and heavy rainfall',
        isCorrect: false,
        explanation:
          'Rain washes pollutants out of the air and clouds block UV radiation.',
      },
      {
        id: 'B',
        text: 'High vehicle traffic, warm temperatures, and intense solar radiation',
        isCorrect: true,
        explanation:
          'Photochemical smog requires NOx, VOCs, and UV sunlight to form ground-level ozone.',
      },
      {
        id: 'C',
        text: 'Sulfur dioxide emissions combined with high humidity at night',
        isCorrect: false,
        explanation:
          'SO2 and fog form industrial smog, not photochemical smog.',
      },
      {
        id: 'D',
        text: 'High wind speeds dispersing atmospheric particulates',
        isCorrect: false,
        explanation:
          'Strong winds disperse pollutants rather than allowing smog to concentrate.',
      },
    ],
  },
  {
    id: 'u7_q2',
    unitId: 7,
    topicId: '7.6',
    questionText:
      'Radon-222 is a naturally occurring indoor air pollutant that poses a serious human health threat because it:',
    options: [
      {
        id: 'A',
        text: 'Is an odorless radioactive gas that seeps from soil/bedrock into basements, causing lung cancer',
        isCorrect: true,
        explanation:
          'Radon forms from radioactive decay of uranium in bedrock and causes lung cancer.',
      },
      {
        id: 'B',
        text: 'Binds irreversibly to hemoglobin, causing immediate asphyxiation',
        isCorrect: false,
        explanation: 'Carbon monoxide (CO) binds to hemoglobin.',
      },
      {
        id: 'C',
        text: 'Causes mesotheliomas due to microscopic mineral fibers trapped in lungs',
        isCorrect: false,
        explanation: 'Asbestos fibers cause mesothelioma.',
      },
      {
        id: 'D',
        text: 'Forms ground-level ozone inside carpet fibers',
        isCorrect: false,
        explanation: 'Ozone requires UV light and atmospheric precursors.',
      },
    ],
  },

  // ================= UNIT 8 =================
  {
    id: 'u8_q1',
    unitId: 8,
    topicId: '8.5',
    questionText:
      'Which aquatic pollutant is most directly responsible for cultural eutrophication and subsequent dead zones?',
    options: [
      {
        id: 'A',
        text: 'Methylmercury',
        isCorrect: false,
        explanation:
          'Mercury bioaccumulates in food webs but does not cause algal blooms.',
      },
      {
        id: 'B',
        text: 'Nitrates and Phosphates',
        isCorrect: true,
        explanation:
          'Excess nutrient runoff fuels rapid algal blooms that deplete dissolved oxygen upon decomposition.',
      },
      {
        id: 'C',
        text: 'Thermal pollution',
        isCorrect: false,
        explanation:
          'Warm water holds less oxygen but is not a primary chemical nutrient driver.',
      },
      {
        id: 'D',
        text: 'Microplastics',
        isCorrect: false,
        explanation: 'Microplastics pose ingestion risks to marine life.',
      },
    ],
  },
  {
    id: 'u8_q2',
    unitId: 8,
    topicId: '8.11',
    questionText:
      'During primary wastewater treatment at a municipal facility, which process takes place?',
    options: [
      {
        id: 'A',
        text: 'Biological breakdown of organic wastes using aerobic bacteria',
        isCorrect: false,
        explanation: 'Biological digestion occurs in secondary treatment.',
      },
      {
        id: 'B',
        text: 'Physical removal of large debris through screens and settling tanks',
        isCorrect: true,
        explanation:
          'Primary treatment relies on mechanical filtration and gravity settling of solids.',
      },
      {
        id: 'C',
        text: 'Chemical disinfection using chlorine or ultraviolet (UV) light',
        isCorrect: false,
        explanation:
          'Disinfection is the final step after secondary treatment.',
      },
      {
        id: 'D',
        text: 'Removal of dissolved nitrates and phosphates through artificial wetlands',
        isCorrect: false,
        explanation:
          'Nutrient removal occurs during advanced tertiary treatment.',
      },
    ],
  },

  // ================= UNIT 9 =================
  {
    id: 'u9_q1',
    unitId: 9,
    topicId: '9.1',
    questionText:
      'Which class of synthetic chemical compounds was primarily responsible for stratospheric ozone depletion prior to the Montreal Protocol?',
    options: [
      {
        id: 'A',
        text: 'Chlorofluorocarbons (CFCs)',
        isCorrect: true,
        explanation:
          'CFCs release free chlorine atoms in the stratosphere that catalyze the destruction of O3 molecules.',
      },
      {
        id: 'B',
        text: 'Organophosphates',
        isCorrect: false,
        explanation: 'Organophosphates are agricultural insecticides.',
      },
      {
        id: 'C',
        text: 'Sulfur dioxide (SO2)',
        isCorrect: false,
        explanation:
          'SO2 causes acid rain and aerosol cooling, not ozone destruction.',
      },
      {
        id: 'D',
        text: 'Polychlorinated biphenyls (PCBs)',
        isCorrect: false,
        explanation:
          'PCBs are toxic industrial compounds stored in fat tissue.',
      },
    ],
  },
  {
    id: 'u9_q2',
    unitId: 9,
    topicId: '9.6',
    questionText:
      'Ocean acidification is primarily driven by which atmospheric process?',
    options: [
      {
        id: 'A',
        text: 'Increased absorption of atmospheric CO2 forming carbonic acid (H2CO3) in seawater',
        isCorrect: true,
        explanation:
          'Dissolved CO2 forms H2CO3, releasing hydrogen ions that lower ocean pH and deplete carbonate.',
      },
      {
        id: 'B',
        text: 'Acid rain falling directly into coastal marine zones',
        isCorrect: false,
        explanation:
          'Acid precipitation impacts freshwater lakes and soils more significantly.',
      },
      {
        id: 'C',
        text: 'Thermal expansion of ocean water reducing bicarbonate solubility',
        isCorrect: false,
        explanation:
          'Thermal expansion causes sea level rise, not acidification.',
      },
      {
        id: 'D',
        text: 'Agricultural runoff of nitric acid into oceanic gyres',
        isCorrect: false,
        explanation: 'Runoff causes localized eutrophication.',
      },
    ],
  },
];

const FRQ_QUESTIONS: FRQQuestion[] = [
  {
    id: 'frq_u1',
    unitId: 1,
    title: 'Unit 1 FRQ: Ecosystem Dynamics & Energy Flow',
    scenario:
      'A researcher measures Net Primary Productivity (NPP) in a temperate forest ecosystem and calculates an NPP of 8,000 kcal/m²/year. Cellular respiration (R) by autotrophs in this same ecosystem is measured at 12,000 kcal/m²/year.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Calculate the Gross Primary Productivity (GPP) for this temperate forest ecosystem. Show your work.',
        rubric:
          'GPP = NPP + R = 8,000 + 12,000 = 20,000 kcal/m²/yr. 1 point for setup, 1 point for correct answer with units.',
      },
      {
        id: 'b',
        question:
          '(b) Explain why NPP is always lower than GPP in any natural ecosystem.',
        rubric:
          '1 point for explaining that autotrophs/plants use a portion of the total glucose produced during GPP for their own cellular respiration (R) to maintain metabolic functions.',
      },
      {
        id: 'c',
        question:
          '(c) Describe how the 10% rule governs energy availability to tertiary consumers in this forest.',
        rubric:
          '1 point for stating only ~10% of energy moves to each consecutive trophic level due to metabolic heat loss. 1 point for calculating 8 kcal/m²/yr reaches tertiary level (8,000 -> 800 -> 80 -> 8).',
      },
    ],
  },
  {
    id: 'frq_u2',
    unitId: 2,
    title: 'Unit 2 FRQ: Island Biogeography & Disturbance',
    scenario:
      'Two uninhabited islands, Island A (50 sq miles, 10 miles offshore) and Island B (5 sq miles, 150 miles offshore), host endemic bird species. A major hurricane strikes Island B, stripping vegetation down to bedrock.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Identify which island (A or B) would be expected to have higher baseline species richness according to the Theory of Island Biogeography. Justify your response.',
        rubric:
          '1 point for identifying Island A. 1 point for justification: Island A is larger (lower extinction rate due to more niches) and closer to mainland (higher immigration rate).',
      },
      {
        id: 'b',
        question:
          '(b) Identify the type of ecological succession that will occur on Island B following the severe hurricane damage described.',
        rubric:
          '1 point for identifying Primary Succession (since stripped to bare bedrock with no remaining topsoil).',
      },
    ],
  },
  {
    id: 'frq_u3',
    unitId: 3,
    title: 'Unit 3 FRQ: Human Demographics & Survivorship',
    scenario:
      'Country X has a Crude Birth Rate (CBR) of 32 per 1,000 individuals and a Crude Death Rate (CDR) of 7 per 1,000 individuals.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Calculate the percent annual population growth rate (r) for Country X (excluding net migration). Show your work.',
        rubric:
          'r = (CBR - CDR) / 10 = (32 - 7) / 10 = 2.5%. 1 point for setup, 1 point for correct value (2.5%).',
      },
      {
        id: 'b',
        question:
          '(b) Using the Rule of 70, calculate the doubling time of Country X’s population in years.',
        rubric:
          'Doubling time = 70 / r = 70 / 2.5 = 28 years. 1 point for correct calculation with units.',
      },
    ],
  },
  {
    id: 'frq_u4',
    unitId: 4,
    title: 'Unit 4 FRQ: Watershed Dynamics & Soil Properties',
    scenario:
      'A local agricultural watershed experiences heavy rainfall events leading to severe soil erosion into a nearby freshwater river system.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Describe how soil texture (relative proportions of sand, silt, and clay) affects soil permeability and water retention.',
        rubric:
          '1 point for noting sandy soils have high permeability/low retention due to large pore space, while clay soils have low permeability/high retention due to tiny pore spaces.',
      },
      {
        id: 'b',
        question:
          '(b) Describe ONE farming practice that farmers can adopt to prevent topsoil loss on sloped land.',
        rubric:
          '1 point for identifying and describing Contour Plowing, Terracing, Strip Cropping, or No-Till Agriculture.',
      },
    ],
  },
  {
    id: 'frq_u5',
    unitId: 5,
    title: 'Unit 5 FRQ: Integrated Pest Management (IPM)',
    scenario:
      'A industrial corn farmer relies heavily on synthetic monoculture fertilizers and broad-spectrum pesticides to maximize seasonal crop yields.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Describe ONE negative environmental consequence associated with long-term pesticide application on agricultural soil ecosystems.',
        rubric:
          '1 point for explaining pest resistance buildup via natural selection OR kill-off of non-target beneficial species/pollinators.',
      },
      {
        id: 'b',
        question:
          '(b) Describe how Integrated Pest Management (IPM) can reduce chemical application while maintaining crop health.',
        rubric:
          '1 point for explaining multi-tiered strategy combining biological controls (predators), physical barriers, crop rotation, and spot-treating pests.',
      },
    ],
  },
  {
    id: 'frq_u6',
    unitId: 6,
    title: 'Unit 6 FRQ: Energy Efficiency & Thermoelectric Power',
    scenario:
      'A municipal utility burns coal to produce electricity. The power plant operates at 35% efficiency and generates 10,000 MWh of electrical energy per month.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Calculate the total chemical energy input (in MWh) required from coal to generate this 10,000 MWh of electricity. Show your work.',
        rubric:
          'Energy Input = Output / Efficiency = 10,000 / 0.35 = 28,571.4 MWh. 1 point for setup, 1 point for correct math.',
      },
      {
        id: 'b',
        question:
          '(b) Describe ONE environmental advantage and ONE environmental disadvantage of replacing this coal plant with a Nuclear Power Plant.',
        rubric:
          '1 point for advantage: Zero direct greenhouse gas (CO2/SO2) emissions during power operation. 1 point for disadvantage: High-level radioactive waste storage hazards.',
      },
    ],
  },
  {
    id: 'frq_u7',
    unitId: 7,
    title: 'Unit 7 FRQ: Photochemical Smog & Thermal Inversions',
    scenario:
      'A major metro area situated in a geographic basin experiences recurring seasonal air pollution events characterized by thick ozone smog and elevated PM2.5 levels.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Describe the chemical inputs and conditions required for ground-level (tropospheric) ozone formation.',
        rubric:
          '1 point for identifying Nitrogen Oxides (NOx), Volatile Organic Compounds (VOCs), and Sunlight (UV radiation).',
      },
      {
        id: 'b',
        question:
          '(b) Explain how a thermal inversion trap aggravates urban air quality in a valley basin.',
        rubric:
          '1 point for explaining a warm layer of air settles over a cool surface air layer, acting as a cap that traps vehicular pollutants and smog near ground level.',
      },
    ],
  },
  {
    id: 'frq_u8',
    unitId: 8,
    title: 'Unit 8 FRQ: Eutrophication & Wastewater Treatment',
    scenario:
      'Runoff from synthetic lawn fertilizers enters a freshwater reservoir, triggering a dense algal bloom followed by a significant die-off of game fish.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Explain the sequence of biological and chemical events that leads to hypoxia (dead zones) following an algal bloom.',
        rubric:
          '1 point for noting algae die and are decomposed by aerobic bacteria. 1 point for noting bacteria consume dissolved oxygen (DO) during respiration, dropping DO levels.',
      },
      {
        id: 'b',
        question:
          '(b) Describe the primary purpose of the SECONDARY stage of municipal wastewater treatment.',
        rubric:
          '1 point for describing biological treatment using aerobic bacteria to digest dissolved organic waste in aeration tanks.',
      },
    ],
  },
  {
    id: 'frq_u9',
    unitId: 9,
    title: 'Unit 9 FRQ: Stratospheric Ozone & Ocean Acidification',
    scenario:
      'Anthropogenic emissions have altered global chemical balances in both the atmosphere and oceans, leading to stratospheric thinning and marine pH shifts.',
    prompts: [
      {
        id: 'a',
        question:
          '(a) Explain how Chlorofluorocarbons (CFCs) deplete stratospheric ozone (O3) molecules.',
        rubric:
          '1 point for explaining UV light splits CFCs releasing free chlorine atoms. 1 point for explaining chlorine acts as a catalyst breaking O3 down into O2.',
      },
      {
        id: 'b',
        question:
          '(b) Describe the chemical mechanism by which elevated atmospheric CO2 causes ocean acidification.',
        rubric:
          '1 point for describing atmospheric CO2 dissolving into ocean water to form carbonic acid (H2CO3), which dissociates releasing H+ ions, lowering ocean pH.',
      },
    ],
  },
];

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState<'mcq' | 'math' | 'frq'>('mcq');
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Filter questions for the selected unit
  const activeQuestions = selectedUnit
    ? QUESTIONS.filter((q) => q.unitId === selectedUnit)
    : [];

  const handleUnitSelect = (unitId: number) => {
    setSelectedUnit(unitId);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(optionId);
    if (
      activeQuestions[currentQuestionIndex].options.find(
        (o) => o.id === optionId
      )?.isCorrect
    ) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">APES Exam Review</h1>
              <p className="text-xs text-slate-400">
                AP Environmental Science Prep
              </p>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <nav className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('mcq');
                setSelectedUnit(null);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'mcq'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Unit Quizzes</span>
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'math'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Math Lab</span>
            </button>
            <button
              onClick={() => setActiveTab('frq')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'frq'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>FRQ Workshop</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ================= TAB 1: MCQ PRACTICE ================= */}
        {activeTab === 'mcq' && (
          <div>
            {!selectedUnit ? (
              // UNIT SELECTION GRID
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    Select an APES Unit
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Choose a unit to test your multiple-choice knowledge.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {APES_UNITS.map((unit) => {
                    const qCount = QUESTIONS.filter(
                      (q) => q.unitId === unit.id
                    ).length;
                    return (
                      <button
                        key={unit.id}
                        onClick={() => handleUnitSelect(unit.id)}
                        className="flex flex-col justify-between p-5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/50 hover:border-emerald-500/50 transition text-left group"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                              Exam Weight: {unit.weight}
                            </span>
                            <span className="text-xs text-slate-500">
                              {qCount} Questions
                            </span>
                          </div>
                          <h3 className="font-semibold text-slate-100 group-hover:text-emerald-400 transition mt-2">
                            {unit.name}
                          </h3>
                        </div>
                        <div className="flex items-center text-xs font-medium text-emerald-400 mt-4">
                          <span>Start Practice</span>
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // QUIZ INTERFACE
              <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="text-xs font-medium text-slate-400 hover:text-white mb-6 flex items-center space-x-1"
                >
                  ← Back to Units
                </button>

                {!quizCompleted && activeQuestions.length > 0 && (
                  <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl">
                    {/* Quiz Progress */}
                    <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-800">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of{' '}
                        {activeQuestions.length}
                      </span>
                      <span className="text-xs text-slate-400">
                        Topic {activeQuestions[currentQuestionIndex].topicId}
                      </span>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-lg md:text-xl font-medium text-slate-100 mb-6 leading-relaxed">
                      {activeQuestions[currentQuestionIndex].questionText}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                      {activeQuestions[currentQuestionIndex].options.map(
                        (option) => {
                          const isSelected = selectedOption === option.id;
                          const isAnswered = selectedOption !== null;

                          let btnStyle =
                            'border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-200';
                          if (isAnswered) {
                            if (option.isCorrect) {
                              btnStyle =
                                'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                            } else if (isSelected) {
                              btnStyle =
                                'border-rose-500/50 bg-rose-500/10 text-rose-300';
                            } else {
                              btnStyle =
                                'border-slate-800/40 bg-slate-900/20 text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={option.id}
                              disabled={isAnswered}
                              onClick={() => handleOptionSelect(option.id)}
                              className={`w-full text-left p-4 rounded-xl border transition flex items-start space-x-3 ${btnStyle}`}
                            >
                              <span className="font-bold text-sm min-w-[20px]">
                                {option.id}.
                              </span>
                              <span className="text-sm leading-relaxed">
                                {option.text}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Explanation Box */}
                    {selectedOption && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6">
                        <div className="flex items-center space-x-2 text-sm font-semibold mb-1">
                          {activeQuestions[currentQuestionIndex].options.find(
                            (o) => o.id === selectedOption
                          )?.isCorrect ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400">Correct!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400" />
                              <span className="text-rose-400">Incorrect</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {
                            activeQuestions[currentQuestionIndex].options.find(
                              (o) => o.id === selectedOption
                            )?.explanation
                          }
                        </p>
                      </div>
                    )}

                    {/* Next Button */}
                    {selectedOption && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition flex items-center justify-center space-x-2"
                      >
                        <span>
                          {currentQuestionIndex + 1 < activeQuestions.length
                            ? 'Next Question'
                            : 'View Results'}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                {/* Completion Screen */}
                {quizCompleted && (
                  <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-8 text-center">
                    <Award className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Quiz Completed!
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">
                      You scored{' '}
                      <span className="text-emerald-400 font-bold">
                        {score}
                      </span>{' '}
                      out of{' '}
                      <span className="text-white font-bold">
                        {activeQuestions.length}
                      </span>
                    </p>
                    <button
                      onClick={() => handleUnitSelect(selectedUnit)}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition inline-flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Try Again</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: MATH LAB ================= */}
        {activeTab === 'math' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                APES Math & Formulas Reference
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Key formulas and step-by-step math breakdowns commonly tested on
                the exam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formula Card 1 */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                  Population Growth Rate (r)
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Calculates net population change per 1,000 individuals as a
                  percentage.
                </p>
                <div className="p-3 bg-slate-900 font-mono text-sm text-center text-slate-200 rounded-lg border border-slate-800 mb-4">
                  r (%) = [(CBR - CDR) / 10]
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Example:</strong> CBR = 20 per 1,000; CDR = 5 per
                  1,000.
                  <br />r = (20 - 5) / 10 = <strong>1.5%</strong>
                </p>
              </div>

              {/* Formula Card 2 */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                  Rule of 70 (Doubling Time)
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Estimates how many years it takes a growing population to
                  double.
                </p>
                <div className="p-3 bg-slate-900 font-mono text-sm text-center text-slate-200 rounded-lg border border-slate-800 mb-4">
                  Doubling Time (yrs) = 70 / r (%)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Example:</strong> Growth rate r = 2.0%.
                  <br />
                  Doubling time = 70 / 2 = <strong>35 years</strong>
                </p>
              </div>

              {/* Formula Card 3 */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                  Primary Productivity
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Net vs Gross Primary Productivity in ecosystems.
                </p>
                <div className="p-3 bg-slate-900 font-mono text-sm text-center text-slate-200 rounded-lg border border-slate-800 mb-4">
                  NPP = GPP - Respiration (R)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>NPP:</strong> Energy stored as biomass available to
                  consumers.
                  <br />
                  <strong>GPP:</strong> Total energy captured via
                  photosynthesis.
                </p>
              </div>

              {/* Formula Card 4 */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                  Percent Change
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Measures increase or decrease over time.
                </p>
                <div className="p-3 bg-slate-900 font-mono text-sm text-center text-slate-200 rounded-lg border border-slate-800 mb-4">
                  % Change = [(New - Old) / Old] × 100
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Example:</strong> Emissions drop from 500 to 400 ppm.
                  <br />
                  [(400 - 500) / 500] × 100 = <strong>-20%</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: FRQ WORKSHOP ================= */}
        {activeTab === 'frq' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                APES Free Response Question (FRQ) Bank
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Review official exam-style prompts with official College Board
                scoring rubrics.
              </p>
            </div>

            <div className="space-y-6">
              {FRQ_QUESTIONS.map((frq) => (
                <div
                  key={frq.id}
                  className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Unit {frq.unitId} FRQ
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {frq.title}
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6 text-sm text-slate-300 leading-relaxed">
                    <strong>Scenario:</strong> {frq.scenario}
                  </div>

                  {/* Prompts */}
                  <div className="space-y-6">
                    {frq.prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="border-t border-slate-800/80 pt-4"
                      >
                        <p className="text-sm font-medium text-slate-100 mb-2">
                          {prompt.question}
                        </p>

                        {/* Collapsible/Visible Scoring Rubric */}
                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                          <span className="font-bold block mb-1">
                            scoring Rubric:
                          </span>
                          {prompt.rubric}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
