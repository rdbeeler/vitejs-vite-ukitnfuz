import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import type { User } from 'firebase/auth';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDM1arBhV-c8edIK4rtrAD4-6ETKMe7anM",
  authDomain: "apes-review.firebaseapp.com",
  projectId: "apes-review",
  storageBucket: "apes-review.firebasestorage.app",
  messagingSenderId: "235956447574",
  appId: "1:235956447574:web:25fb21b044a2d7b6b74ef7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- TYPES ---
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  unitId: number;
  topicId: string;
  questionText: string;
  options: Option[];
}

export interface APESUnit {
  id: number;
  title: string;
  description: string;
  examWeight: string;
}

export interface MathProblem {
  id: string;
  title: string;
  category: string;
  formula: string;
  prompt: string;
  correctAnswer: string;
  unitLabel: string;
  solutionSteps: string[];
}

export interface RubricItem {
  pointId: string;
  label: string;
  criteria: string;
  sampleResponse: string;
}

export interface FRQPrompt {
  id: string;
  unitId: number;
  type: 'Experiment Design' | 'Environmental Problem' | 'Calculations & Solution';
  title: string;
  scenarioText: string;
  rubric: RubricItem[];
}

// --- UNITS ---
const APES_UNITS: APESUnit[] = [
  { id: 1, title: 'The Living World: Ecosystems', description: 'Biomes, biogeochemical cycles, energy flow, and 10% trophic rule.', examWeight: '6–8%' },
  { id: 2, title: 'The Living World: Biodiversity', description: 'Ecosystem services, island biogeography, tolerance ranges, and succession.', examWeight: '6–8%' },
  { id: 3, title: 'Populations', description: 'r/K selection, survivorship curves, age-structure diagrams, and Rule of 70.', examWeight: '10–15%' },
  { id: 4, title: 'Earth Systems and Resources', description: 'Plate tectonics, soil horizons, atmospheric layers, watershed dynamics, and ENSO.', examWeight: '10–15%' },
  { id: 5, title: 'Land and Water Use', description: 'Tragedy of the Commons, Green Revolution, irrigation, pest management, and mining.', examWeight: '10–15%' },
  { id: 6, title: 'Energy Resources and Consumption', description: 'Fossil fuels, nuclear power, renewable energy efficiency, and fuel combustion.', examWeight: '10–15%' },
  { id: 7, title: 'Atmospheric Pollution', description: 'Photochemical smog, thermal inversions, acid deposition, and indoor air hazards.', examWeight: '7–10%' },
  { id: 8, title: 'Aquatic and Terrestrial Pollution', description: 'Eutrophication, bioaccumulation, endocrine disruptors, waste treatment, and LD50.', examWeight: '7–10%' },
  { id: 9, title: 'Global Change', description: 'Stratospheric ozone depletion, greenhouse gases, ocean acidification, and invasive species.', examWeight: '15–20%' },
];

// --- MATH DATA ---
const FORMULAS = [
  { name: 'Rule of 70 (Doubling Time)', formula: 'Doubling Time (yrs) = 70 / % Growth Rate (r)', note: 'Do NOT convert percentage to decimal! (e.g., if r = 2%, divide 70 by 2).' },
  { name: 'Population Growth Rate (% r)', formula: 'r (%) = [(CBR - CDR) / 10]  OR  r (%) = [(Births + Imm) - (Deaths + Emm)] / Total Pop * 100', note: 'CBR and CDR are per 1,000 individuals.' },
  { name: 'Net Primary Productivity (NPP)', formula: 'NPP = GPP - Respiration (R)', note: 'Units are usually kcal/m²/year or g/m²/year.' },
  { name: 'Half-Life Decay', formula: 'Remaining = Initial * (0.5)^(Elapsed Time / Half-Life)', note: 'Count the number of half-life cycles passed by dividing total time by half-life duration.' },
  { name: 'Percent Change', formula: '% Change = [(New Value - Old Value) / Old Value] * 100', note: 'Positive result = increase; negative result = decrease.' }
];

const MATH_PRACTICE_PROBLEMS: MathProblem[] = [
  {
    id: 'm1',
    title: 'Rule of 70 Calculation',
    category: 'Populations (Unit 3)',
    formula: 'Doubling Time = 70 / r',
    prompt: 'A country currently has a population growth rate of 2.5%. Assuming the growth rate remains constant, how many years will it take for the population to double?',
    correctAnswer: '28',
    unitLabel: 'years',
    solutionSteps: [
      'Identify formula: Doubling Time = 70 / r',
      'Plug in growth rate directly as a percentage (r = 2.5): 70 / 2.5',
      '70 / 2.5 = 28 years'
    ]
  },
  {
    id: 'm2',
    title: 'Half-Life Radioactive Decay',
    category: 'Energy Resources (Unit 6)',
    formula: 'Remaining = Initial * (1/2)^cycles',
    prompt: 'A radioactive waste sample contains 800 grams of Uranium-235 (half-life = 700 million years). How many grams of U-235 will remain after 2,100 million years (2.1 billion years)?',
    correctAnswer: '100',
    unitLabel: 'grams',
    solutionSteps: [
      'Calculate number of half-life cycles: 2,100 million / 700 million = 3 cycles',
      'Cycle 1 (700M yrs): 800g → 400g',
      'Cycle 2 (1,400M yrs): 400g → 200g',
      'Cycle 3 (2,100M yrs): 200g → 100g'
    ]
  },
  {
    id: 'm3',
    title: 'Primary Productivity Calculation',
    category: 'Ecosystems (Unit 1)',
    formula: 'NPP = GPP - R',
    prompt: 'A forest ecosystem has a Gross Primary Productivity (GPP) of 18,000 kcal/m²/year and plant respiration (R) is 11,000 kcal/m²/year. Calculate the Net Primary Productivity (NPP).',
    correctAnswer: '7000',
    unitLabel: 'kcal/m²/year',
    solutionSteps: [
      'Formula: NPP = GPP - R',
      'NPP = 18,000 - 11,000',
      'NPP = 7,000 kcal/m²/year'
    ]
  },
  {
    id: 'm4',
    title: 'Crude Birth & Death Rates (% r)',
    category: 'Populations (Unit 3)',
    formula: 'r (%) = (CBR - CDR) / 10',
    prompt: 'A city records a Crude Birth Rate (CBR) of 34 per 1,000 and a Crude Death Rate (CDR) of 9 per 1,000. What is its annual population growth rate in percent?',
    correctAnswer: '2.5',
    unitLabel: '%',
    solutionSteps: [
      'Formula: r (%) = (CBR - CDR) / 10',
      'r = (34 - 9) / 10',
      'r = 25 / 10 = 2.5%'
    ]
  }
];

// --- FRQ DATA BANK ---
const FRQ_PROMPTS: FRQPrompt[] = [
  {
    id: 'frq_1',
    unitId: 8,
    type: 'Environmental Problem',
    title: 'Agricultural Runoff & Hypoxia in Gulf of Mexico',
    scenarioText: 'In recent decades, large agricultural operations in the Midwestern United States have increased fertilizer usage. Runoff from these farms flows into the Mississippi River watershed and eventually empties into the Gulf of Mexico, creating an expanding "Dead Zone" every summer.',
    rubric: [
      {
        pointId: 'p1',
        label: '(a) Identify primary nutrient',
        criteria: 'Identify either Nitrogen (nitrates) or Phosphorus (phosphates) as the primary nutrient responsible for eutrophication.',
        sampleResponse: 'Nitrates from synthetic fertilizers are the main nutrient causing excessive algal blooms in marine coastal waters.'
      },
      {
        pointId: 'p2',
        label: '(b) Describe the mechanism causing hypoxia',
        criteria: 'Describe how algal blooms die, are decomposed by aerobic bacteria, and consume dissolved oxygen in the water column.',
        sampleResponse: 'When the massive algal bloom dies, aerobic decomposers (bacteria) break down the organic matter. This decomposition process consumes large amounts of dissolved oxygen, dropping oxygen levels (hypoxia) and causing fish kills.'
      },
      {
        pointId: 'p3',
        label: '(c) Propose a realistic solution',
        criteria: 'Propose a specific agricultural or conservation strategy to reduce nutrient runoff into nearby waterways.',
        sampleResponse: 'Farmers can plant riparian buffer zones (strips of native vegetation along streams) to absorb and filter excess fertilizer before it reaches tributaries.'
      }
    ]
  },
  {
    id: 'frq_2',
    unitId: 5,
    type: 'Experiment Design',
    title: 'Pesticide Resistance in Agricultural Pests',
    scenarioText: 'A farmer notices that a newly introduced synthetic pesticide was highly effective in killing corn rootworms during the first two years of application. However, by year four, the pesticide efficacy dropped significantly despite using higher concentrations.',
    rubric: [
      {
        pointId: 'p1',
        label: '(a) Formulate a hypothesis',
        criteria: 'Formulate a testable hypothesis linking repeated pesticide exposure to the survival and reproduction of resistant pests.',
        sampleResponse: 'If corn rootworms are repeatedly exposed to the synthetic pesticide, then subsequent generations will exhibit higher survival rates due to natural selection for pesticide resistance genes.'
      },
      {
        pointId: 'p2',
        label: '(b) Identify control group & independent variable',
        criteria: 'Identify the independent variable (pesticide concentration/exposure) and a valid control group (no pesticide exposure).',
        sampleResponse: 'The independent variable is the exposure to pesticide. The control group consists of a population of corn rootworms raised in identical conditions without pesticide exposure.'
      },
      {
        pointId: 'p3',
        label: '(c) Explain Integrated Pest Management (IPM)',
        criteria: 'Explain how using an IPM strategy (e.g., crop rotation, beneficial predator insects) reduces the likelihood of pesticide resistance.',
        sampleResponse: 'Implementing crop rotation interrupts the life cycle of the corn rootworms without applying chemical selection pressure, preventing resistant populations from dominating.'
      }
    ]
  }
];

// --- QUESTIONS BANK ---
const QUESTIONS: Question[] = [
  {
    id: 'u1_q1',
    unitId: 1,
    topicId: '1.4',
    questionText: 'Which process in the carbon cycle removes carbon dioxide directly from the atmosphere and converts it into organic glucose?',
    options: [
      { id: 'A', text: 'Cellular Respiration', isCorrect: false, explanation: 'Respiration burns glucose and releases CO2 back into the atmosphere.' },
      { id: 'B', text: 'Photosynthesis', isCorrect: true, explanation: 'Autotrophs fix atmospheric CO2 into organic carbon (glucose) during photosynthesis.' },
      { id: 'C', text: 'Combustion', isCorrect: false, explanation: 'Combustion releases stored carbon from organic molecules into the atmosphere.' },
      { id: 'D', text: 'Nitrogen Fixation', isCorrect: false, explanation: 'Nitrogen fixation converts atmospheric nitrogen (N2) into ammonia.' }
    ]
  },
  {
    id: 'u1_q2',
    unitId: 1,
    topicId: '1.8',
    questionText: 'According to the 10% rule of energy transfer in an ecosystem, if a producer level contains 10,000 kcal of energy, approximately how much energy is available to secondary consumers?',
    options: [
      { id: 'A', text: '1,000 kcal', isCorrect: false, explanation: '1,000 kcal is transferred to primary consumers (10% of 10,000).' },
      { id: 'B', text: '100 kcal', isCorrect: true, explanation: 'Primary consumers receive 1,000 kcal (10%) and secondary consumers receive 100 kcal (10% of 1,000).' },
      { id: 'C', text: '10 kcal', isCorrect: false, explanation: '10 kcal would reach the tertiary consumers.' },
      { id: 'D', text: '10000 kcal', isCorrect: false, explanation: 'Energy decreases at each trophic level due to metabolic heat loss.' }
    ]
  },
  {
    id: 'u3_q1',
    unitId: 3,
    topicId: '3.3',
    questionText: 'Which of the following characteristics is typically associated with r-selected species?',
    options: [
      { id: 'A', text: 'High levels of parental care', isCorrect: false, explanation: 'Parental care is a signature trait of K-selected species.' },
      { id: 'B', text: 'Long lifespans and slow population growth', isCorrect: false, explanation: 'r-selected species typically have short lifespans and rapid growth.' },
      { id: 'C', text: 'Numerous, small offspring', isCorrect: true, explanation: 'r-selected species invest energy in producing large numbers of offspring quickly.' },
      { id: 'D', text: 'Strong competitive ability in climax communities', isCorrect: false, explanation: 'r-selected species are opportunistic colonizers rather than late-succession competitors.' }
    ]
  },
  {
    id: 'u8_q1',
    unitId: 8,
    topicId: '8.5',
    questionText: 'Which aquatic pollutant is most directly responsible for cultural eutrophication and subsequent dead zones?',
    options: [
      { id: 'A', text: 'Methylmercury', isCorrect: false, explanation: 'Mercury bioaccumulates in food webs but does not cause algal blooms.' },
      { id: 'B', text: 'Nitrates and Phosphates', isCorrect: true, explanation: 'Excess nutrient runoff fuels rapid algal blooms that deplete dissolved oxygen upon decomposition.' },
      { id: 'C', text: 'Thermal pollution', isCorrect: false, explanation: 'Warm water holds less oxygen but is not a primary chemical nutrient driver.' },
      { id: 'D', text: 'Microplastics', isCorrect: false, explanation: 'Microplastics pose ingestion risks to aquatic wildlife.' }
    ]
  }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'units' | 'math' | 'frq' | 'unit_practice'>('units');
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [userBadges, setUserBadges] = useState<number[]>([]);
  
  // Math state
  const [userMathInputs, setUserMathInputs] = useState<Record<string, string>>({});
  const [mathChecked, setMathChecked] = useState<Record<string, boolean>>({});

  // FRQ state
  const [selectedFrqId, setSelectedFrqId] = useState<string>(FRQ_PROMPTS[0].id);
  const [studentFrqText, setStudentFrqText] = useState<Record<string, string>>({});
  const [selfScores, setSelfScores] = useState<Record<string, Record<string, boolean>>>({});
  const [showRubric, setShowRubric] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data()?.completedUnits) {
            setUserBadges(userDoc.data().completedUnits);
          }
        } catch (e) {
          console.error("Firestore error:", e);
        }
      } else {
        setUserBadges([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      alert("Sign-in failed. Ensure popups are allowed on managed devices.");
    }
  };

  const handleOptionSelect = (qId: string, optId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const markUnitComplete = async (unitId: number) => {
    if (!userBadges.includes(unitId)) {
      const updated = [...userBadges, unitId];
      setUserBadges(updated);
      if (user) {
        await setDoc(doc(db, 'users', user.uid), { completedUnits: updated }, { merge: true });
      }
    }
  };

  const toggleSelfScore = (frqId: string, pointId: string) => {
    setSelfScores(prev => ({
      ...prev,
      [frqId]: {
        ...prev[frqId],
        [pointId]: !prev[frqId]?.[pointId]
      }
    }));
  };

  const activeFrq = FRQ_PROMPTS.find(f => f.id === selectedFrqId) || FRQ_PROMPTS[0];
  const currentEarnedPoints = Object.values(selfScores[activeFrq.id] || {}).filter(Boolean).length;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a' }}>🌱 APES Mastery Hub</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>AP Environmental Science Practice & Diagnostics</p>
        </div>
        
        {/* NAV TABS */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => { setViewMode('units'); setSelectedUnit(null); }}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: viewMode === 'units' || viewMode === 'unit_practice' ? '#ffffff' : 'transparent', color: viewMode === 'units' || viewMode === 'unit_practice' ? '#0284c7' : '#64748b', boxShadow: viewMode === 'units' || viewMode === 'unit_practice' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
            📚 Multiple Choice
          </button>
          <button 
            onClick={() => { setViewMode('math'); setSelectedUnit(null); }}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: viewMode === 'math' ? '#ffffff' : 'transparent', color: viewMode === 'math' ? '#0284c7' : '#64748b', boxShadow: viewMode === 'math' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
            🧮 Math Lab
          </button>
          <button 
            onClick={() => { setViewMode('frq'); setSelectedUnit(null); }}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: viewMode === 'frq' ? '#ffffff' : 'transparent', color: viewMode === 'frq' ? '#0284c7' : '#64748b', boxShadow: viewMode === 'frq' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
            📝 FRQ Workshop
          </button>
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>{user.displayName || user.email}</span>
              <button onClick={() => signOut(auth)} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Sign In with Google
            </button>
          )}
        </div>
      </header>

      {/* VIEW 1: FRQ WORKSHOP */}
      {viewMode === 'frq' && (
        <main style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          {/* PROMPT SELECTOR SIDEBAR */}
          <aside style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>FRQ Library</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FRQ_PROMPTS.map((prompt) => {
                const isSelected = prompt.id === selectedFrqId;
                return (
                  <button
                    key={prompt.id}
                    onClick={() => setSelectedFrqId(prompt.id)}
                    style={{
                      textAlign: 'left',
                      padding: '12px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 'bold', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '4px', marginBottom: '4px' }}>
                      Unit {prompt.unitId} • {prompt.type}
                    </span>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{prompt.title}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ACTIVE FRQ WORKSPACE */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* PROMPT BOX */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '4px 10px', borderRadius: '6px' }}>
                  Unit {activeFrq.unitId} — {activeFrq.type}
                </span>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>
                  Self-Score: {currentEarnedPoints} / {activeFrq.rubric.length} pts
                </span>
              </div>
              <h2 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '20px' }}>{activeFrq.title}</h2>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #0284c7', fontSize: '15px', color: '#334155', lineHeight: '1.6' }}>
                {activeFrq.scenarioText}
              </div>
            </div>

            {/* DRAFTING TEXTAREA */}
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '16px' }}>Your Written Response</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748b' }}>
                Tip: Avoid vague words like "it damages the environment." Be specific! Describe mechanisms and exact environmental impacts.
              </p>
              <textarea
                rows={10}
                placeholder="Type your response here before revealing the rubric..."
                value={studentFrqText[activeFrq.id] || ''}
                onChange={(e) => setStudentFrqText({ ...studentFrqText, [activeFrq.id]: e.target.value })}
                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.5', boxSizing: 'border-box' }}
              />

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowRubric({ ...showRubric, [activeFrq.id]: !showRubric[activeFrq.id] })}
                  style={{ padding: '10px 20px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {showRubric[activeFrq.id] ? 'Hide Scoring Rubric' : 'Reveal Scoring Rubric & Benchmark Answers'}
                </button>
              </div>
            </div>

            {/* SELF-SCORING RUBRIC */}
            {showRubric[activeFrq.id] && (
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #86efac' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#166534', fontSize: '18px' }}>📋 Official-Style AP Scoring Rubric</h3>
                <p style={{ color: '#475569', fontSize: '13px', marginBottom: '20px' }}>
                  Read your response above against each criterion. Check off the points you successfully earned:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activeFrq.rubric.map((item) => {
                    const isChecked = selfScores[activeFrq.id]?.[item.pointId] || false;

                    return (
                      <div key={item.pointId} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: isChecked ? '#f0fdf4' : '#fafafa' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <input
                            type="checkbox"
                            id={item.pointId}
                            checked={isChecked}
                            onChange={() => toggleSelfScore(activeFrq.id, item.pointId)}
                            style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <div style={{ flex: 1 }}>
                            <label htmlFor={item.pointId} style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '15px', cursor: 'pointer' }}>
                              {item.label}
                            </label>
                            <p style={{ margin: '6px 0 10px 0', fontSize: '14px', color: '#334155', lineHeight: '1.4' }}>
                              <strong>Rubric Criteria:</strong> {item.criteria}
                            </p>
                            
                            {/* SAMPLE BENCHMARK RESPONSE */}
                            <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #16a34a', fontSize: '13px', color: '#1e293b' }}>
                              <strong style={{ color: '#16a34a' }}>Exemplary Student Answer:</strong> "{item.sampleResponse}"
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* VIEW 2: MATH LAB */}
      {viewMode === 'math' && (
        <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* CHEATSHEET SECTION */}
          <section style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ marginTop: 0, color: '#0f172a', fontSize: '20px' }}>📐 APES Formula Quick Reference</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {FORMULAS.map((f, i) => (
                <div key={i} style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #0284c7' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '15px' }}>{f.name}</h4>
                  <code style={{ display: 'block', backgroundColor: '#e0f2fe', padding: '8px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', color: '#0c4a6e', marginBottom: '8px' }}>
                    {f.formula}
                  </code>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>💡 <strong>Note:</strong> {f.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* MATH PRACTICE PROBLEMS */}
          <section style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ marginTop: 0, color: '#0f172a', fontSize: '20px' }}>✍️ Calculation Practice Lab</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Practice solving exam-style quantitative problems. Try calculating without a calculator first to build speed!</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {MATH_PRACTICE_PROBLEMS.map((prob) => {
                const userVal = userMathInputs[prob.id] || '';
                const isChecked = mathChecked[prob.id];
                const isCorrect = userVal.trim() === prob.correctAnswer;

                return (
                  <div key={prob.id} style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                        {prob.category}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                        Key Formula: {prob.formula}
                      </span>
                    </div>

                    <h3 style={{ margin: '8px 0', fontSize: '16px', color: '#0f172a' }}>{prob.title}</h3>
                    <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{prob.prompt}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                      <input 
                        type="text" 
                        placeholder="Your Answer..."
                        value={userVal}
                        onChange={(e) => setUserMathInputs({ ...userMathInputs, [prob.id]: e.target.value })}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #94a3b8', fontSize: '14px', width: '150px' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>{prob.unitLabel}</span>
                      
                      <button 
                        onClick={() => setMathChecked({ ...mathChecked, [prob.id]: true })}
                        style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Check Answer
                      </button>
                    </div>

                    {isChecked && (
                      <div style={{ marginTop: '16px', padding: '14px', borderRadius: '8px', backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2', border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}` }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: isCorrect ? '#166534' : '#991b1b' }}>
                          {isCorrect ? '✅ Correct!' : `❌ Incorrect. Correct answer: ${prob.correctAnswer} ${prob.unitLabel}`}
                        </p>
                        <div style={{ fontSize: '13px', color: '#334155' }}>
                          <strong>Step-by-Step Solution:</strong>
                          <ol style={{ margin: '6px 0 0 0', paddingLeft: '20px' }}>
                            {prob.solutionSteps.map((step, idx) => (
                              <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* VIEW 3: MULTIPLE CHOICE UNITS GRID */}
      {viewMode === 'units' && selectedUnit === null && (
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', color: '#1e293b', margin: 0 }}>Select an APES Unit</h2>
            <span style={{ fontSize: '14px', color: '#64748b' }}>
              Mastery Progress: <strong>{userBadges.length} / 9 Units</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {APES_UNITS.map((unit) => {
              const isCompleted = userBadges.includes(unit.id);
              const unitQCount = QUESTIONS.filter(q => q.unitId === unit.id).length;

              return (
                <div key={unit.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '4px' }}>
                        Unit {unit.id} • Weight: {unit.examWeight}
                      </span>
                      {isCompleted && (
                        <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          ✓ Mastered
                        </span>
                      )}
                    </div>
                    <h3 style={{ margin: '12px 0 8px 0', fontSize: '18px', color: '#0f172a' }}>{unit.title}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.4' }}>{unit.description}</p>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{unitQCount} Question{unitQCount === 1 ? '' : 's'} Available</span>
                    <button 
                      onClick={() => { setSelectedUnit(unit.id); setViewMode('unit_practice'); }} 
                      style={{ padding: '10px 16px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Practice Unit →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* VIEW 4: ACTIVE UNIT PRACTICE (MULTIPLE CHOICE) */}
      {(viewMode === 'unit_practice' || selectedUnit !== null) && (
        <main style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <button onClick={() => { setSelectedUnit(null); setViewMode('units'); }} style={{ padding: '6px 12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px', fontWeight: '500' }}>
            ← Back to Units
          </button>
          
          <h2 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>
            Unit {selectedUnit}: {APES_UNITS.find(u => u.id === selectedUnit)?.title}
          </h2>

          {QUESTIONS.filter(q => q.unitId === selectedUnit).length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', margin: 0 }}>No multiple choice questions loaded for Unit {selectedUnit} yet. Select another unit or add items to the <code>QUESTIONS</code> array!</p>
            </div>
          ) : (
            QUESTIONS.filter(q => q.unitId === selectedUnit).map((q) => (
              <div key={q.id} style={{ marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 'bold', backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>Topic {q.topicId}</span>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1e293b', margin: '12px 0 16px 0', lineHeight: '1.5' }}>{q.questionText}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt) => {
                    const isSelected = selectedAnswers[q.id] === opt.id;
                    let bg = '#f8fafc';
                    let border = '#e2e8f0';
                    if (isSelected) {
                      bg = opt.isCorrect ? '#f0fdf4' : '#fef2f2';
                      border = opt.isCorrect ? '#22c55e' : '#ef4444';
                    }
                    return (
                      <div key={opt.id}>
                        <button
                          onClick={() => handleOptionSelect(q.id, opt.id)}
                          style={{ width: '100%', textAlign: 'left', padding: '12px 16px', backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
                          <strong style={{ marginRight: '8px' }}>{opt.id}.</strong> {opt.text}
                        </button>
                        {isSelected && (
                          <div style={{ marginTop: '6px', padding: '10px 14px', backgroundColor: opt.isCorrect ? '#dcfce7' : '#fee2e2', color: opt.isCorrect ? '#166534' : '#991b1b', borderRadius: '6px', fontSize: '13px', lineHeight: '1.4' }}>
                            <strong>{opt.isCorrect ? 'Correct!' : 'Incorrect:'}</strong> {opt.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {selectedUnit !== null && (
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => markUnitComplete(selectedUnit)} 
                style={{ padding: '12px 24px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Mark Unit as Mastered ✓
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}