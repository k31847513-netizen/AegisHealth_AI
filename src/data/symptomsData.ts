import { SymptomGuideItem } from '../types/medical';

export const symptomsGuideData: SymptomGuideItem[] = [
  {
    id: 'sym-fever',
    name: 'Fever (Pyrexia)',
    category: 'General',
    iconName: 'Thermometer',
    simpleExplanation: 'A temporary rise in your body temperature, typically above 100.4°F (38°C), representing an active immune response fighting off infections.',
    commonPossibleCauses: [
      'Viral infections (such as the common cold, influenza, COVID-19)',
      'Bacterial infections (such as strep throat, urinary tract infections, pneumonia)',
      'Post-vaccination immune activation',
      'Inflammatory conditions or autoimmune flares',
      'Heat exhaustion or heavy physical overexertion'
    ],
    generalHealthPrecautions: [
      'Stay thoroughly hydrated with water, herbal teas, broths, or electrolyte solutions.',
      'Rest in a cool, well-ventilated room wearing light, breathable clothing.',
      'Use lukewarm sponge baths if feeling uncomfortable (avoid freezing cold water or alcohol rubs).',
      'Track your temperature with a clean oral or digital thermometer every 4–6 hours.'
    ],
    whenToSeekMedicalAttention: [
      'A fever that lasts longer than 3 full consecutive days without improvement.',
      'A temperature exceeding 103°F (39.4°C) in adults or 102°F in young children.',
      'Fever accompanied by painful urination, productive chest cough, or severe earache.',
      'Fever recurring intermittently over several weeks.'
    ],
    emergencyWarningSigns: [
      'Fever with a stiff neck, sudden confusion, or severe photophobia (sensitivity to light).',
      'Difficulty breathing, chest tightness, or blue-tinted lips/fingers.',
      'A new, rapidly spreading purple or dark red skin rash that does not fade when pressed.',
      'Inability to stay awake, seizures, or persistent severe vomiting preventing any fluid intake.'
    ],
    relatedLabTests: [
      'Complete Blood Count (CBC) with Differential – evaluates White Blood Cell (WBC) count and neutrophil shift.',
      'C-Reactive Protein (CRP) & ESR – measures systemic inflammatory response.',
      'Urinalysis & Urine Culture – checks for urinary tract infection signs.'
    ]
  },
  {
    id: 'sym-headache',
    name: 'Headache (Cephalea)',
    category: 'Neurological',
    iconName: 'Brain',
    simpleExplanation: 'Pain or aching sensation in any region of your head, which may range from dull, band-like tension to throbbing, unilateral discomfort.',
    commonPossibleCauses: [
      'Tension and musculoskeletal strain from posture, screen time, or emotional stress',
      'Dehydration or skipping regular meals (hypoglycemia)',
      'Lack of adequate restorative sleep or sudden caffeine withdrawal',
      'Migraines or vascular headaches triggered by light, sounds, or hormone shifts',
      'Sinus inflammation, seasonal allergies, or eye strain'
    ],
    generalHealthPrecautions: [
      'Drink 16–24 oz of water immediately, as mild dehydration is one of the most frequent headache triggers.',
      'Rest in a dimly lit, quiet room with a cool compress on your forehead or warm compress on your neck muscles.',
      'Take 20-20-20 screen breaks (every 20 minutes look at something 20 feet away for 20 seconds).',
      'Gently massage temples, jaw muscles, and upper shoulders.'
    ],
    whenToSeekMedicalAttention: [
      'Headaches occurring more than twice a week or progressively worsening over weeks.',
      'Headaches that awaken you from sleep or consistently worsen when coughing or bending over.',
      'Headaches accompanied by mild nausea, light sensitivity, or persistent sinus congestion.',
      'Headache following a minor bump to the head that does not resolve.'
    ],
    emergencyWarningSigns: [
      '"Thunderclap" headache: Sudden, explosive pain reaching maximum intensity within seconds (the worst headache of your life).',
      'Headache with neurological deficits: weakness or numbness on one side of face/body, slurred speech, or vision loss.',
      'Headache paired with high fever, stiff neck, and confusion or altered consciousness.',
      'Headache following direct head trauma with loss of consciousness or memory loss.'
    ],
    relatedLabTests: [
      'Fasting Blood Glucose – checks for hypoglycemic episodes.',
      'Electrolyte Panel – checks sodium and potassium balance.',
      'Complete Blood Count – checks for systemic infection or severe anemia.'
    ]
  },
  {
    id: 'sym-fatigue',
    name: 'Fatigue & Low Energy',
    category: 'General',
    iconName: 'BatteryLow',
    simpleExplanation: 'A persistent feeling of physical or mental exhaustion that is not relieved by ordinary rest or a good night of sleep, distinct from everyday tiredness.',
    commonPossibleCauses: [
      'Nutritional deficiencies (e.g. low iron/hemoglobin, low Vitamin D, low Vitamin B12)',
      'Thyroid underactivity (hypothyroidism)',
      'Poor sleep architecture, insomnia, or obstructive sleep apnea',
      'Chronic psychological stress, anxiety, or burnout',
      'Blood sugar dysregulation or prediabetes',
      'Post-viral recovery syndrome'
    ],
    generalHealthPrecautions: [
      'Maintain consistent sleep and wake times, including on weekends.',
      'Step outside into natural morning sunlight for 10–15 minutes within an hour of waking.',
      'Eat balanced meals featuring protein, healthy fats, and complex carbohydrates to stabilize blood sugar.',
      'Stay properly hydrated throughout the day; avoid heavy caffeine intake after 2:00 PM.'
    ],
    whenToSeekMedicalAttention: [
      'Fatigue persisting for more than 2 to 4 weeks with no clear lifestyle cause.',
      'Fatigue accompanied by unintended weight loss, swollen lymph nodes, or persistent low fever.',
      'Feeling short of breath when climbing a single flight of stairs.',
      'Noticing unusually pale skin, brittle nails, or cold intolerance.'
    ],
    emergencyWarningSigns: [
      'Fatigue accompanied by acute chest pain, pressure, or shortness of breath.',
      'Sudden profound muscle weakness or inability to stand upright.',
      'Severe shortness of breath with irregular or racing heart palpitations.',
      'Fainting spells (syncope) or dizziness upon standing.'
    ],
    relatedLabTests: [
      'Complete Blood Count (CBC) – evaluates Hemoglobin and Red Blood Cells for anemia.',
      'Ferritin & Iron Saturation – assesses bone marrow iron reserves.',
      'TSH (Thyroid Stimulating Hormone) – assesses thyroid glandular activity.',
      'Vitamin D (25-OH) & Vitamin B12 – assesses cellular energy cofactors.'
    ]
  },
  {
    id: 'sym-weakness',
    name: 'Muscle Weakness & Reduced Stamina',
    category: 'Musculoskeletal',
    iconName: 'Activity',
    simpleExplanation: 'A noticeable decrease in physical muscle strength or endurance, making everyday physical tasks feel heavier or harder than usual.',
    commonPossibleCauses: [
      'Electrolyte imbalances (potassium, magnesium, calcium, or sodium)',
      'Severe lack of physical activity or prolonged bed rest (deconditioning)',
      'Iron deficiency anemia reducing oxygen delivery to working muscle fibers',
      'Vitamin D deficiency impacting muscular contractile efficiency',
      'Nerve compression or peripheral neuropathy'
    ],
    generalHealthPrecautions: [
      'Ensure balanced electrolyte intake through mineral-rich foods (bananas, leafy greens, coconut water, seeds).',
      'Begin gentle, non-strenuous daily walking or low-impact stretching to keep circulation moving.',
      'Avoid sudden maximum-effort lifting while feeling physically depleted.',
      'Review any newly started medications with your healthcare team.'
    ],
    whenToSeekMedicalAttention: [
      'Weakness localized to one specific arm, leg, or hand.',
      'Progressive muscle weakness that gradually worsens over several days.',
      'Muscle cramping or twitching accompanied by muscle atrophy (shrinking).',
      'Weakness interfering with holding coffee cups, buttoning shirts, or climbing curbs.'
    ],
    emergencyWarningSigns: [
      'Sudden unilateral facial droop, arm weakness, or difficulty speaking (FAST stroke signs).',
      'Rapid ascending weakness moving up from feet to legs and torso.',
      'Sudden loss of bowel or bladder control accompanied by lower back numbness.',
      'Weakness combined with difficulty swallowing or difficulty breathing.'
    ],
    relatedLabTests: [
      'Comprehensive Metabolic Panel (CMP) – monitors Potassium, Sodium, Calcium, and Kidney functions.',
      'Serum Magnesium & Phosphorus – key minerals for neuromuscular signaling.',
      'Creatine Kinase (CK) – assesses acute muscle cell breakdown.'
    ]
  },
  {
    id: 'sym-cough',
    name: 'Cough (Acute & Persistent)',
    category: 'Respiratory',
    iconName: 'Wind',
    simpleExplanation: 'A natural reflex that clears your airway and throat of irritants, mucus, or foreign particles. It can be dry (hacking) or wet (productive of phlegm).',
    commonPossibleCauses: [
      'Upper respiratory viral infections (common cold, viral bronchitis)',
      'Post-nasal drip from allergic rhinitis or sinusitis',
      'Gastroesophageal reflux disease (GERD) where stomach acid irritates the vocal cords',
      'Asthma, environmental pollutants, smoke, or dry indoor air',
      'Certain prescription medications (e.g. ACE inhibitors used for blood pressure)'
    ],
    generalHealthPrecautions: [
      'Sip warm water, broths, or tea with a spoonful of honey (for adults and children over 1 year).',
      'Use a clean cool-mist humidifier in the bedroom to moisten airways at night.',
      'Elevate your head with an extra pillow while sleeping to minimize nighttime post-nasal drip.',
      'Avoid exposure to cigarette smoke, harsh chemical cleaning vapors, and strong perfumes.'
    ],
    whenToSeekMedicalAttention: [
      'Cough lasting longer than 3 weeks (chronic cough).',
      'Cough producing thick yellow, green, or foul-smelling mucus alongside a fever.',
      'Cough accompanied by wheezing or difficulty taking a deep breath.',
      'Unexplained weight loss or night sweats paired with cough.'
    ],
    emergencyWarningSigns: [
      'Coughing up visible blood or pink frothy sputum.',
      'Severe shortness of breath, gasping for air, or stridor (high-pitched breathing sound).',
      'Inability to speak in full sentences due to air hunger.',
      'Chest pain with inspiration or rapid breathing.'
    ],
    relatedLabTests: [
      'Complete Blood Count (CBC) – evaluates white blood cell count for bacterial vs viral signatures.',
      'Sputum Analysis or Viral Respiratory PCR Panel – identifies pathogen origin.'
    ]
  },
  {
    id: 'sym-dizziness',
    name: 'Dizziness & Lightheadedness',
    category: 'Neurological',
    iconName: 'Compass',
    simpleExplanation: 'A feeling of being unsteady, woozy, or lightheaded, or a sensation that you or your surroundings are spinning (vertigo).',
    commonPossibleCauses: [
      'Orthostatic hypotension (temporary blood pressure drop upon standing up quickly)',
      'Dehydration, heat exposure, or low blood sugar (hypoglycemia)',
      'Inner ear vestibular disturbances (BPPV, labyrinthitis, vestibular neuritis)',
      'Low hemoglobin or anemia reducing cerebral oxygenation',
      'Medication side effects (especially blood pressure or sedative medications)'
    ],
    generalHealthPrecautions: [
      'Sit or lie down immediately when feeling lightheaded to prevent falls.',
      'Transition slowly from lying down to sitting, and from sitting to standing.',
      'Drink a glass of water and eat a balanced snack if you have not eaten recently.',
      'Avoid driving or operating machinery until the sensation completely clears.'
    ],
    whenToSeekMedicalAttention: [
      'Recurrent bouts of dizziness triggered by head movements.',
      'Dizziness accompanied by ringing in the ears (tinnitus) or muffled hearing.',
      'Lightheadedness that occurs frequently after beginning a new medication.',
      'Dizziness lasting longer than a couple of hours.'
    ],
    emergencyWarningSigns: [
      'Dizziness accompanied by double vision, slurred speech, or facial numbness.',
      'Dizziness with acute chest pain, irregular palpitations, or fainting.',
      'Inability to walk straight or sudden loss of motor coordination.',
      'Severe, sudden onset vertigo paired with a new severe headache.'
    ],
    relatedLabTests: [
      'Complete Blood Count (CBC) – rules out low hemoglobin / anemia.',
      'Comprehensive Metabolic Panel (CMP) – assesses hydration status and blood sugar.',
      'Vitamin B12 & Iron Studies – checks neurological and hematological factors.'
    ]
  },
  {
    id: 'sym-nausea',
    name: 'Nausea & Stomach Upset',
    category: 'Digestive',
    iconName: 'AlertCircle',
    simpleExplanation: 'An unpleasant, queasy sensation in the stomach or throat, accompanied by the urge to vomit.',
    commonPossibleCauses: [
      'Viral gastroenteritis ("stomach flu") or food-borne illness',
      'Motion sickness or inner ear disturbances',
      'Acid reflux, gastritis, or peptic irritation',
      'Early pregnancy (morning sickness)',
      'Medications, antibiotics, or vitamins taken on an empty stomach'
    ],
    generalHealthPrecautions: [
      'Sip small quantities of clear fluids slowly (water, electrolyte drinks, ginger or peppermint tea).',
      'Follow the BRAT diet (Bananas, Rice, Applesauce, Toast) once ready to tolerate food.',
      'Avoid greasy, heavily spiced, or highly acidic foods until the stomach settles.',
      'Rest in an upright or slightly reclined position rather than lying flat immediately.'
    ],
    whenToSeekMedicalAttention: [
      'Nausea preventing fluid retention for more than 24 hours.',
      'Symptoms accompanied by persistent diarrhea for over 48 hours.',
      'Noticeable signs of dehydration (dark urine, dry mouth, dizziness upon standing).',
      'Nausea recurring regularly after specific meals.'
    ],
    emergencyWarningSigns: [
      'Vomiting blood or coffee-ground-like dark material.',
      'Severe, localized abdominal pain or rigid, board-like abdomen.',
      'Nausea accompanied by acute crushing chest pain, radiating arm pain, or shortness of breath.',
      'High fever paired with an inability to keep any fluids down.'
    ],
    relatedLabTests: [
      'Basic Metabolic Panel (BMP) – monitors electrolytes and kidney hydration (BUN/Creatinine).',
      'Liver Function Tests (LFTs) & Lipase – evaluates liver and pancreas status.',
      'Urine hCG – evaluates pregnancy in reproductive-age females.'
    ]
  },
  {
    id: 'sym-stomach-pain',
    name: 'Stomach & Abdominal Pain',
    category: 'Digestive',
    iconName: 'ShieldAlert',
    simpleExplanation: 'Discomfort, cramping, or aching between your chest and groin, varying from mild indigestion to acute spasmodic cramping.',
    commonPossibleCauses: [
      'Indigestion, gas entrapment, or constipation',
      'Gastritis, acid reflux, or peptic ulcer disease',
      'Irritable Bowel Syndrome (IBS) or food intolerances (lactose, gluten)',
      'Menstrual cramps in females',
      'Mild foodborne stomach bug'
    ],
    generalHealthPrecautions: [
      'Apply a warm heating pad or warm water bottle to your abdomen for 15–20 minutes.',
      'Eat small, bland meals and avoid carbonated beverages, cruciferous vegetables, or rich greasy foods.',
      'Stay hydrated with warm water or chamomile tea.',
      'Do not take NSAIDs (ibuprofen, aspirin) for undiagnosed stomach pain, as they can irritate stomach lining.'
    ],
    whenToSeekMedicalAttention: [
      'Abdominal pain that persists or steadily worsens over 24 to 48 hours.',
      'Pain accompanied by fever, persistent vomiting, or painful urination.',
      'Unexplained weight loss or changes in bowel habits lasting more than a week.',
      'Pain that consistently flares after fatty or rich meals.'
    ],
    emergencyWarningSigns: [
      'Severe, sudden excruciating pain (especially sharp pain localized to the lower right abdomen).',
      'Abdomen that is hard, rigid, swollen, or extremely tender to light touch.',
      'Black tarry stools, bright red rectal bleeding, or vomiting blood.',
      'Pain accompanied by dizziness, faintness, or high fever with chills.'
    ],
    relatedLabTests: [
      'Complete Blood Count (CBC) – checks for elevated WBC indicating acute inflammation or appendicitis.',
      'Comprehensive Metabolic Panel (CMP) – assesses liver enzymes and renal markers.',
      'Amylase & Lipase – screens for acute pancreatic inflammation.',
      'Stool Occult Blood Test – checks for gastrointestinal bleeding.'
    ]
  }
];
