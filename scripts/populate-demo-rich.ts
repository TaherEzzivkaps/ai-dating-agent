import { getDb } from '../lib/db';

const profilesMap: Record<string, any> = {
  'elena-rostova': {
    summary: 'Staff Product Designer at Stripe focused on developer infrastructure and minimalist payment interfaces. Passionate about natural wines, brutalist spatial architecture, and V6+ bouldering.',
    needs: [
      {
        label: 'Intellectual Sparring Without Ego',
        detail: 'Values quick conceptual debates on systems design, typography, and ethics without defensiveness.',
        evidence: [{ source: 'linkedin', ref: 'experience_stripe', quote_or_note: 'Staff Product Designer leading Developer Platform' }],
        confidence: 0.94,
      },
      {
        label: 'Creative Autonomy & Deep Focus',
        detail: 'Values independent sabbatical routines and respects emotional self-sufficiency.',
        evidence: [{ source: 'instagram', ref: 'post_kyoto_sabbatical', quote_or_note: 'Three weeks in Kyoto studying woodblock textures' }],
        confidence: 0.91,
      },
    ],
    hobbies: [
      {
        label: 'Technical V6+ Indoor Bouldering',
        detail: 'Trains 3 mornings weekly at Dogpatch Boulders; focuses on dynamic technical problem solving.',
        evidence: [{ source: 'instagram', ref: 'post_dogpatch_v6', quote_or_note: 'Sent the technical sloper problem after four attempts' }],
        confidence: 0.96,
      },
      {
        label: 'Low-Intervention Natural Wines',
        detail: 'Collects unfiltered pet-nat and orange wines from Jura and Georgia.',
        evidence: [{ source: 'instagram', ref: 'caption_jura_harvest', quote_or_note: 'Skin-contact Ribolla Gialla with ambient fermentation' }],
        confidence: 0.92,
      },
    ],
    interests: [
      {
        label: 'Brutalist Architecture & Scandinavian Modernism',
        detail: 'Admires Marcel Breuer and tactile Scandinavian furniture design.',
        evidence: [{ source: 'instagram', ref: 'post_breuer_building', quote_or_note: 'Form following concrete gravity' }],
        confidence: 0.9,
      },
    ],
    friction_points: [
      {
        label: 'Quarterly Transatlantic Travel Cycles',
        detail: 'Frequent work cycles in Tokyo and London can compress synchronous personal time.',
        evidence: [{ source: 'linkedin', ref: 'talks_conferences', quote_or_note: 'Keynote speaking engagements across EU & Asia' }],
        confidence: 0.85,
      },
    ],
    dating_persona: 'I value intentional conversations that bypass corporate pleasantries. I spend my days shaping developer tools and evenings bouldering or hunting down unusual natural wines. I look for genuine intellectual curiosity, dry humor, and partners who have their own deep craft.',
    overall_confidence: 0.94,
    data_quality: 'rich',
  },

  'marcus-vance': {
    summary: 'Founder & Generative Audio Architect at ArchiMetric in San Francisco. Dedicated to physical analog vinyl preservation, algorithmic sound synthesis, and high-altitude trail exploration.',
    needs: [
      {
        label: 'Sensory & Aesthetic Congruence',
        detail: 'Drawn to partners with deep tactile appreciation for craft, materials, acoustics, and intentionality.',
        evidence: [{ source: 'linkedin', ref: 'founder_archimetric', quote_or_note: 'Architecting generative spatial acoustics' }],
        confidence: 0.95,
      },
    ],
    hobbies: [
      {
        label: 'Analog Japanese Ambient Vinyl',
        detail: 'Curates rare 1980s ambient pressings, including Hiroshi Yoshimura and Midori Takada.',
        evidence: [{ source: 'instagram', ref: 'post_tokyo_vinyl_haul', quote_or_note: 'Mint pressing of Hiroshi Yoshimura Green discovered in Shibuya' }],
        confidence: 0.97,
      },
    ],
    interests: [
      {
        label: 'Eurorack Synthesizers & Spatial Acoustics',
        detail: 'Builds custom analog audio hardware modules and researches psychoacoustics.',
        evidence: [{ source: 'linkedin', ref: 'patents_spatial_audio', quote_or_note: 'Patents in binaural synthesis algorithms' }],
        confidence: 0.93,
      },
    ],
    friction_points: [
      {
        label: 'Deep Focus Immersion Sprints',
        detail: 'Can become deeply engrossed in acoustic driver testing for multi-day stretches.',
        evidence: [{ source: 'linkedin', ref: 'release_schedule', quote_or_note: 'Studio sprint deep work cycles' }],
        confidence: 0.82,
      },
    ],
    dating_persona: 'I find joy in discovering how things sound and feel at their foundational level. Whether we are discussing vinyl grooves, brutalist buildings, or mountain ridges, I value honest curiosity and quiet laughter. Let us skip performative networking and share what genuinely moves us.',
    overall_confidence: 0.95,
    data_quality: 'rich',
  },

  'julian-hayes': {
    summary: 'Principal Distributed Systems Engineer at Anthropic in New York. Specializes in low-latency consensus protocols, functional programming, and British dry satirical essays.',
    needs: [
      {
        label: 'Cognitive Symmetry & Unfiltered Banter',
        detail: 'Enjoys rigorous debate on machine intelligence and philosophy without corporate platitudes.',
        evidence: [{ source: 'linkedin', ref: 'anthropic_systems', quote_or_note: 'Lead architect for multi-cluster model serving pipelines' }],
        confidence: 0.93,
      },
    ],
    hobbies: [
      {
        label: 'West Village Jazz Cellars & Espresso Chemistry',
        detail: 'Frequent patron of Smalls Jazz Club and single-origin anaerobic natural espresso cupping.',
        evidence: [{ source: 'instagram', ref: 'smalls_session', quote_or_note: 'Late set listening to live bop at Smalls' }],
        confidence: 0.91,
      },
    ],
    interests: [
      {
        label: 'Distributed Consensus & Type Theory',
        detail: 'Deep interest in verifiable computation, Haskell semantics, and open protocol design.',
        evidence: [{ source: 'linkedin', ref: 'github_projects', quote_or_note: 'Maintainer of raft-rs consensus engine' }],
        confidence: 0.96,
      },
    ],
    friction_points: [
      {
        label: 'Extreme Preference for Low-Key Recovery Weekends',
        detail: 'Recharges through homebound reading sessions, which can clash with high-stimulus nightlife.',
        evidence: [{ source: 'instagram', ref: 'weekend_reading', quote_or_note: '48 hours offline with Borges and tea' }],
        confidence: 0.88,
      },
    ],
    dating_persona: 'I build fault-tolerant computing infrastructure by day and unwind with obscure jazz and dry essays by night. I value quick wit, intellectual honesty, and conversations where neither person feels the need to pretend they have it all figured out.',
    overall_confidence: 0.92,
    data_quality: 'rich',
  },

  'dominic-sterling': {
    summary: 'Design Director at Studio Form & Architecture in Brooklyn. Obsessed with Scandinavian timber joinery, editorial publishing, and tactile interior acoustics.',
    needs: [
      {
        label: 'Visual Discipline & Shared Spatial Appreciation',
        detail: 'Loves sharing quiet observations on proportions, light, materials, and urban history.',
        evidence: [{ source: 'linkedin', ref: 'studio_form', quote_or_note: 'Leading cultural space and museum architecture' }],
        confidence: 0.92,
      },
    ],
    hobbies: [
      {
        label: 'Medium Format Architectural Photography',
        detail: 'Shoots black-and-white Hasselblad film documenting industrial waterfront facades.',
        evidence: [{ source: 'instagram', ref: 'hasselblad_dumbo', quote_or_note: 'Red Hook grain on Tri-X 400' }],
        confidence: 0.94,
      },
    ],
    interests: [
      {
        label: 'Mid-Century Nordic Furniture & Exhibition Curation',
        detail: 'Collects original Alvar Aalto and Hans Wegner archive catalogs.',
        evidence: [{ source: 'instagram', ref: 'aalto_exhibit', quote_or_note: 'Bent plywood curves under gallery skylights' }],
        confidence: 0.9,
      },
    ],
    friction_points: [
      {
        label: 'High Aesthetic Rigidity',
        detail: 'Can be overly fastidious regarding lighting, acoustics, and environment choices.',
        evidence: [{ source: 'instagram', ref: 'light_critique', quote_or_note: 'Flickering 4000K overheads are a design crime' }],
        confidence: 0.86,
      },
    ],
    dating_persona: 'Architecture taught me to pay attention to light and space. On a date, I am attentive to subtleties and stories rather than resumes. If you love discovering hidden bakeries or debating chair joinery, we will get along wonderfully.',
    overall_confidence: 0.91,
    data_quality: 'rich',
  },

  'kaito-tanaka': {
    summary: 'Head of Research at Monolith Robotics in San Francisco. Researches dynamic bipedal locomotion, reinforcement learning, and mechanical watchmaking.',
    needs: [
      {
        label: 'Appreciation for Complex Physical Systems',
        detail: 'Enjoys explaining mechanics, robotics, and learning from other disciplines.',
        evidence: [{ source: 'linkedin', ref: 'phd_berkeley', quote_or_note: 'PhD in Robotics from UC Berkeley' }],
        confidence: 0.95,
      },
    ],
    hobbies: [
      {
        label: 'Mechanical Horology & Precision Assembly',
        detail: 'Restores vintage mechanical chronograph movements in a home micro-lathe workshop.',
        evidence: [{ source: 'instagram', ref: 'watch_movement', quote_or_note: 'Servicing an escapement wheel under 20x magnification' }],
        confidence: 0.93,
      },
    ],
    interests: [
      {
        label: 'Sim-to-Real Locomotion & Deep Reinforcement Learning',
        detail: 'Published author on agile quadrupeds and humanoid balance stabilization.',
        evidence: [{ source: 'linkedin', ref: 'papers_rss', quote_or_note: 'Paper on agile legged locomotion over rugged terrain' }],
        confidence: 0.96,
      },
    ],
    friction_points: [
      {
        label: 'Asynchronous Texting Cadence',
        detail: 'Often leaves phone in the hardware lab for hours at a time, requiring understanding.',
        evidence: [{ source: 'instagram', ref: 'hardware_lab_hours', quote_or_note: 'Lab cleanroom days' }],
        confidence: 0.87,
      },
    ],
    dating_persona: 'I spend my waking hours getting robotic systems to walk and balance in the real world. Outside of work, I love vintage mechanical watches, good espresso, and unhurried conversations about how things are made. Looking for someone grounded and inquisitive.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'soren-lindqvist': {
    summary: 'Creative Technologist & Ambient Sound Artist based in New York. Builds responsive audio installations, granular synthesizers, and spatial lighting sculptures.',
    needs: [
      {
        label: 'Atmospheric Sensitivity & Creative Spontaneity',
        detail: 'Craves genuine emotional presence, late-night gallery walks, and open-ended curiosity.',
        evidence: [{ source: 'linkedin', ref: 'creative_sound', quote_or_note: 'Interactive sound installations for biennials and public institutions' }],
        confidence: 0.9,
      },
    ],
    hobbies: [
      {
        label: 'Field Recording & Hydrophone Sound Hunting',
        detail: 'Captures sonic textures under East River docks and inside subway ventilation tunnels.',
        evidence: [{ source: 'instagram', ref: 'field_recording', quote_or_note: 'Hydrophone recordings of tidal currents under the Manhattan Bridge' }],
        confidence: 0.94,
      },
    ],
    interests: [
      {
        label: 'Granular Synthesis & Generative Visuals',
        detail: 'Writes TouchDesigner and Max/MSP software for experiential music exhibitions.',
        evidence: [{ source: 'instagram', ref: 'patch_preview', quote_or_note: 'Granular reverb algorithm mapping crowd density' }],
        confidence: 0.92,
      },
    ],
    friction_points: [
      {
        label: 'Unconventional Nocturnal Work Rhythms',
        detail: 'Frequently works in recording studios from midnight to dawn during exhibition runs.',
        evidence: [{ source: 'instagram', ref: 'night_studio', quote_or_note: '03:00 AM mixing session' }],
        confidence: 0.85,
      },
    ],
    dating_persona: 'Sound shapes how we experience the world. I love listening closely—to music, city atmospheres, and conversations. I appreciate partners who are comfortable with silence, artistic improvisation, and wandering into small bookstore cafes.',
    overall_confidence: 0.9,
    data_quality: 'rich',
  },

  'chloe-moreau': {
    summary: 'Contemporary Art Gallery Curator between Paris and New York. Specializes in non-traditional sculpture, post-digital ceramics, and experimental artist monographs.',
    needs: [
      {
        label: 'Cultural Sophistication Without Pretension',
        detail: 'Appreciates high cultural literacy paired with genuine warmth and self-deprecating humor.',
        evidence: [{ source: 'linkedin', ref: 'curator_post', quote_or_note: 'Curatorial director for emerging sculpture program' }],
        confidence: 0.93,
      },
    ],
    hobbies: [
      {
        label: 'Antique Bookhunting & Parisian Salon Dinners',
        detail: 'Collects avant-garde exhibition prints and hosts intimate 8-person dinners.',
        evidence: [{ source: 'instagram', ref: 'quai_bouquinistes', quote_or_note: 'Strolling the Seine bouquinistes for 1960s artist manifestos' }],
        confidence: 0.95,
      },
    ],
    interests: [
      {
        label: 'Post-Digital Ceramics & Spatial Sculpture',
        detail: 'Passionate about artists blending 3D clay printing with ancient wood firing.',
        evidence: [{ source: 'instagram', ref: 'ceramic_biennale', quote_or_note: 'Rough unglazed stoneware capturing geological time' }],
        confidence: 0.91,
      },
    ],
    friction_points: [
      {
        label: 'Exhibition Season Demands',
        detail: 'Art Basel and Frieze calendar requires intense transatlantic presence in fall and spring.',
        evidence: [{ source: 'linkedin', ref: 'fairs_schedule', quote_or_note: 'Coordinating gallery presentations globally' }],
        confidence: 0.86,
      },
    ],
    dating_persona: 'Art is my life, but I have no patience for snobbery. I love lively dinner table banter, discovering brilliant underground artists, and traveling on impulse. I seek someone with their own fierce passions who can laugh at life’s absurdities.',
    overall_confidence: 0.92,
    data_quality: 'rich',
  },

  'maya-lin-torres': {
    summary: 'Senior Climate Tech Strategist in Seattle, WA. Works on grid decarbonization modeling, renewable transmission policy, and backcountry alpine splitboarding.',
    needs: [
      {
        label: 'Action-Oriented Optimism & Outdoor Stamina',
        detail: 'Wants a partner who pairs intellectual rigor with a love for wilderness exploration.',
        evidence: [{ source: 'linkedin', ref: 'climate_lead', quote_or_note: 'Lead Analyst for Grid Modernization & Decarbonization' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'Cascades Backcountry Splitboarding',
        detail: 'Earns turns in winter backcountry around Mount Baker and Snoqualmie Pass.',
        evidence: [{ source: 'instagram', ref: 'baker_skin_track', quote_or_note: 'Skin track at dawn with 3,000 feet of untracked powder ahead' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Energy Storage Economics & Federal Transmission Policy',
        detail: 'Researches long-duration iron-air batteries and clean energy markets.',
        evidence: [{ source: 'linkedin', ref: 'whitepaper_ferc', quote_or_note: 'Author of public analysis on FERC regional transmission order' }],
        confidence: 0.95,
      },
    ],
    friction_points: [
      {
        label: 'Intense Alpine Weekend Schedules',
        detail: 'Often heads into mountain zones on Friday evenings with zero cell reception.',
        evidence: [{ source: 'instagram', ref: 'cabin_offgrid', quote_or_note: 'Off-grid in the North Cascades till Sunday night' }],
        confidence: 0.88,
      },
    ],
    dating_persona: 'I work on clean energy because I want this planet to thrive, and I spend my weekends exploring the Pacific Northwest mountains. I value honesty, physical grit, sharp minds, and making pour-over coffee while watching the fog lift.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'liam-gallagher-writer': {
    summary: 'Literary Essayist & Novelist based in Austin, TX. Writes long-form cultural criticism for national publications; collector of vintage manual typewriters and Texas folk vinyl.',
    needs: [
      {
        label: 'Nuanced Conversational Depth & Vulnerability',
        detail: 'Prefers long, meandering evening conversations about human nature, literature, and memory.',
        evidence: [{ source: 'linkedin', ref: 'editorial_contributor', quote_or_note: 'Contributing essayist for major literary quarterlies' }],
        confidence: 0.91,
      },
    ],
    hobbies: [
      {
        label: 'Manual Typewriter Restoration',
        detail: 'Rebuilds Olympia SM3 and Hermes 3000 typewriters for tactile drafting sessions.',
        evidence: [{ source: 'instagram', ref: 'hermes_3000', quote_or_note: 'The rhythmic mechanical clatter of a clean Hermes ribbon' }],
        confidence: 0.95,
      },
    ],
    interests: [
      {
        label: 'Southern Gothic Literature & Archival Non-Fiction',
        detail: 'Studied Flannery O’Connor, Cormac McCarthy, and regional historical letters.',
        evidence: [{ source: 'instagram', ref: 'austin_bookshop', quote_or_note: 'Reading first edition archival letters at the Ransom Center' }],
        confidence: 0.92,
      },
    ],
    friction_points: [
      {
        label: 'Intense Solitary Writing Retreats',
        detail: 'Goes dark during manuscript deadlines for weeks at a time.',
        evidence: [{ source: 'instagram', ref: 'hill_country_cabin', quote_or_note: 'Finishing draft three in the Texas Hill Country' }],
        confidence: 0.86,
      },
    ],
    dating_persona: 'Words are how I navigate existence. I love diner coffee booths, unhurried evening walks, and discussing books that made us see the world differently. I am looking for someone authentic, observant, and unafraid of deep waters.',
    overall_confidence: 0.91,
    data_quality: 'rich',
  },

  'zara-chen': {
    summary: 'Synthetic Biology Founder in San Francisco. Pioneering engineered enzymes for plastic biodegradation; ceramic pottery wheel enthusiast and tea ceremony practitioner.',
    needs: [
      {
        label: 'Audacious Ambition Paired with Grounded Calm',
        detail: 'Values high technical drive balanced by meditative, screen-free tactile hobbies.',
        evidence: [{ source: 'linkedin', ref: 'biotech_founder', quote_or_note: 'Founder & CEO of BioCycle Therapeutics' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'High-Fire Stoneware Pottery & Wheel Throwing',
        detail: 'Throws minimalist ceramic tableware using natural ash glazes in the Mission.',
        evidence: [{ source: 'instagram', ref: 'mission_ceramics', quote_or_note: 'Centering 6 lbs of dark grogged clay on the wheel' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Directed Enzyme Evolution & Circular Bio-Economy',
        detail: 'Published author in Nature Biotechnology on PETase enzyme kinetics.',
        evidence: [{ source: 'linkedin', ref: 'nature_paper', quote_or_note: 'Accelerating plastic polymer degradation through deep mutational scanning' }],
        confidence: 0.97,
      },
    ],
    friction_points: [
      {
        label: 'Founder Operational Pressure',
        detail: 'Board meetings and clinical pilot schedules require high calendar intentionality.',
        evidence: [{ source: 'linkedin', ref: 'venture_fundraise', quote_or_note: 'Scaling synthetic enzyme manufacturing' }],
        confidence: 0.84,
      },
    ],
    dating_persona: 'I engineer biology to clean up the planet by day and work with wet clay on the pottery wheel by night. I value scientific curiosity, emotional maturity, quiet confidence, and someone who knows how to savor a good pot of oolong tea.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'alex-rivera': {
    summary: '35mm Cinematographer & Documentary Director in Los Angeles. Directs visual essays on urban preservation, skate subcultures, and analog film stock chemistry.',
    needs: [
      {
        label: 'Visual Spontaneity & Open Emotional Expression',
        detail: 'Seeks partners who embrace road trips, artistic risk-taking, and raw honesty.',
        evidence: [{ source: 'linkedin', ref: 'director_of_photography', quote_or_note: 'Documentary DP for Sundance-selected features' }],
        confidence: 0.93,
      },
    ],
    hobbies: [
      {
        label: 'Darkroom Chemistry & Hand-Developed 35mm Prints',
        detail: 'Mixes silver halide chemistry at home to print large-format gelatin silver photographs.',
        evidence: [{ source: 'instagram', ref: 'red_light_darkroom', quote_or_note: 'Watching the print emerge in the D-76 developer tray' }],
        confidence: 0.95,
      },
    ],
    interests: [
      {
        label: 'Late 20th-Century Cinema & Brutalist Cityscapes',
        detail: 'Reveres Wim Wenders, Wong Kar-wai, and Los Angeles architectural noir.',
        evidence: [{ source: 'instagram', ref: 'la_noir_facade', quote_or_note: 'Neon reflections on wet asphalt along Sunset' }],
        confidence: 0.9,
      },
    ],
    friction_points: [
      {
        label: 'Unpredictable Production Shoots',
        detail: 'Can be called away for documentary shoots on short notice.',
        evidence: [{ source: 'linkedin', ref: 'film_shoot_production', quote_or_note: 'On location for 3-week documentary schedule' }],
        confidence: 0.86,
      },
    ],
    dating_persona: 'I tell human stories through light, shadows, and film grain. I value authentic laughter, late-night conversations over diner pancakes, and someone who appreciates the beauty in everyday, imperfect moments.',
    overall_confidence: 0.91,
    data_quality: 'rich',
  },

  'sophia-al-mansoor': {
    summary: 'Deep-Tech & Climate Venture Partner based in London and NYC. Former Oxford materials science researcher; equestrian show jumper and collector of 20th-century geometric abstraction.',
    needs: [
      {
        label: 'Global Outlook & Strategic Vision',
        detail: 'Appreciates intellectual range across economics, diplomacy, science, and the arts.',
        evidence: [{ source: 'linkedin', ref: 'venture_partner_oxford', quote_or_note: 'Partner investing in frontier compute and decarbonization' }],
        confidence: 0.95,
      },
    ],
    hobbies: [
      {
        label: 'Equestrian Show Jumping',
        detail: 'Trains competitive warmblood horses in the English countryside on weekends.',
        evidence: [{ source: 'instagram', ref: 'equestrian_oxfordshire', quote_or_note: 'Morning schooling over 1.30m oxers in Oxfordshire' }],
        confidence: 0.94,
      },
    ],
    interests: [
      {
        label: 'Solid-State Battery Chemistry & Materials Physics',
        detail: 'Regular contributor on advanced battery breakthroughs and industrial scale-up.',
        evidence: [{ source: 'linkedin', ref: 'materials_research', quote_or_note: 'Oxford Materials DPhil research in ceramic electrolytes' }],
        confidence: 0.96,
      },
    ],
    friction_points: [
      {
        label: 'High Mobility Lifestyle',
        detail: 'Splits time regularly across Mayfair, Manhattan, and Zurich.',
        evidence: [{ source: 'linkedin', ref: 'board_directorships', quote_or_note: 'Active global board seats' }],
        confidence: 0.87,
      },
    ],
    dating_persona: 'I invest in hard technologies that reshape the future, but I value personal simplicity. On a date, I enjoy honest conversations over a great glass of wine, discussing history, and laughing together about the absurdities of life.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'ethan-brooks': {
    summary: 'Mechanical Aerospace Engineer & Mountain Ultra-Athlete in Boulder, CO. Designs satellite thermal radiator systems; finishes 100-mile mountain endurance races.',
    needs: [
      {
        label: 'Shared Outdoor Drive & Mental Fortitude',
        detail: 'Attracted to partners with their own demanding physical or intellectual goals.',
        evidence: [{ source: 'linkedin', ref: 'aerospace_engineer', quote_or_note: 'Senior Thermal Systems Lead at Ball Aerospace' }],
        confidence: 0.95,
      },
    ],
    hobbies: [
      {
        label: 'Ultra-Distance Mountain Running',
        detail: 'Trains on Colorado 14ers; completed Leadville 100 and Hardrock 100 qualifiers.',
        evidence: [{ source: 'instagram', ref: 'leadville_trail', quote_or_note: 'Dawn above timberline at Hope Pass' }],
        confidence: 0.97,
      },
    ],
    interests: [
      {
        label: 'Spacecraft Cryogenics & Thermodynamic Modeling',
        detail: 'Designs passive cryogenic cooling loops for deep space sensor packages.',
        evidence: [{ source: 'linkedin', ref: 'nasa_thermal_payload', quote_or_note: 'Payload thermal lead for NASA astrophysics missions' }],
        confidence: 0.96,
      },
    ],
    friction_points: [
      {
        label: '5:00 AM Weekend Training Starts',
        detail: 'Bedtime and wake-up cadence during ultra-marathon training blocks are strictly early.',
        evidence: [{ source: 'instagram', ref: 'early_training_miles', quote_or_note: '04:30 AM alarm for 30-mile ridge run' }],
        confidence: 0.89,
      },
    ],
    dating_persona: 'I love pushing boundaries—whether calculating heat transfer in outer space or running 100 miles over mountain passes. I am humble, quiet, and deeply loyal. I am looking for someone with an adventurous spirit and a warm heart.',
    overall_confidence: 0.94,
    data_quality: 'rich',
  },

  'tara-sharma': {
    summary: 'Computational Neuroscientist in San Francisco. Maps cortical neural manifolds and brain-computer interfaces; sourdough fermentation enthusiast and classical Indian violinist.',
    needs: [
      {
        label: 'Curiosity on Human Consciousness & Empathy',
        detail: 'Drawn to deep listeners who enjoy exploring the mysteries of mind, memory, and art.',
        evidence: [{ source: 'linkedin', ref: 'ucsf_neuroscience', quote_or_note: 'Postdoctoral Fellow in Neural Engineering at UCSF' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'Carnatic Classical Violin & Raga Improvisation',
        detail: 'Plays microtonal Carnatic ragas; practices daily acoustic ear training.',
        evidence: [{ source: 'instagram', ref: 'carnatic_raga', quote_or_note: 'Evening Kalyani raga practice with the acoustic tambura' }],
        confidence: 0.95,
      },
    ],
    interests: [
      {
        label: 'Electrophysiology & Latent Neural Dynamics',
        detail: 'Published author on neural decoding algorithms for speech motor restoration.',
        evidence: [{ source: 'linkedin', ref: 'bci_speech_nature', quote_or_note: 'Decoding continuous speech from human motor cortex' }],
        confidence: 0.97,
      },
    ],
    friction_points: [
      {
        label: 'Academic Research Deadlines',
        detail: 'Conference review cycles (NeurIPS, SfN) cause intense focus periods twice a year.',
        evidence: [{ source: 'linkedin', ref: 'neurips_reviews', quote_or_note: 'NeurIPS workshop and paper submissions' }],
        confidence: 0.83,
      },
    ],
    dating_persona: 'I spend my days deciphering how billions of neurons create our experience of reality. In my personal life, I love classical violin, baking warm sourdough, and sharing honest conversations that cut through superficial pretense.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'noah-kim': {
    summary: 'Culinary Research Chef & Fermentation Specialist in Chicago. Directs R&D for a Michelin-starred test kitchen; explores wild koji, garum, and Korean heritage vinegars.',
    needs: [
      {
        label: 'Sensory Enthusiasm & Shared Table Culture',
        detail: 'Finds connection through shared meals, sensory curiosity, and joyful hospitality.',
        evidence: [{ source: 'linkedin', ref: 'rd_culinary_lead', quote_or_note: 'Head of Culinary Innovation & Fermentation Lab' }],
        confidence: 0.95,
      },
    ],
    hobbies: [
      {
        label: 'Koji Cultivation & Ancient Jang Fermentation',
        detail: 'Maintains temperature-controlled koji incubation cedar boxes for custom miso and shoyu.',
        evidence: [{ source: 'instagram', ref: 'cedar_moro_koji', quote_or_note: 'Fluffy white Aspergillus oryzae mycelium blooming over barley' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Food Microbiology & Ancient Food Chemistry',
        detail: 'Studies traditional temple fermentation techniques across East Asia.',
        evidence: [{ source: 'instagram', ref: 'heritage_vinegar', quote_or_note: 'Three-year aged persimmon vinegar with mother culture' }],
        confidence: 0.92,
      },
    ],
    friction_points: [
      {
        label: 'Evening & Weekend Culinary Services',
        detail: 'Service hours in fine dining mean Monday and Tuesday are typical off-days.',
        evidence: [{ source: 'linkedin', ref: 'restaurant_schedule', quote_or_note: 'Dinner tasting menu operations' }],
        confidence: 0.87,
      },
    ],
    dating_persona: 'Food is how I show love and connect with culture. I love wandering farmer markets, tasting wild ingredients, and cooking for people I care about. Looking for someone warm, open-minded, and happy to share a great meal.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'amara-okafor': {
    summary: 'Human Rights Appellate Litigator & Chess Candidate Master in New York. Argues civil rights and immigration appeals before Federal Circuit Courts; competitive blitz chess player.',
    needs: [
      {
        label: 'Moral Conviction & Uncompromising Integrity',
        detail: 'Drawn to partners with strong ethical spines and deep empathy for others.',
        evidence: [{ source: 'linkedin', ref: 'appellate_counsel', quote_or_note: 'Staff Attorney for Constitutional Rights & Appellate Defense' }],
        confidence: 0.95,
      },
    ],
    hobbies: [
      {
        label: 'Washington Square Park Blitz Chess',
        detail: 'Plays 3-minute blitz games with a 2100 USCF rating; analyzes Sicilian defenses.',
        evidence: [{ source: 'instagram', ref: 'wsp_chess_board', quote_or_note: 'Tactical endgame puzzle in the park on Sunday afternoon' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Constitutional Jurisprudence & Voting Rights Policy',
        detail: 'Author of legal briefs on statutory interpretation and equal protection.',
        evidence: [{ source: 'linkedin', ref: 'supreme_court_briefs', quote_or_note: 'Co-author of amicus briefs filed before the Supreme Court' }],
        confidence: 0.96,
      },
    ],
    friction_points: [
      {
        label: 'High Emotional Weight of Human Rights Cases',
        detail: 'High-stakes trials require decompression and understanding from a partner.',
        evidence: [{ source: 'linkedin', ref: 'trial_defense', quote_or_note: 'Emergency injunction and habeas litigation' }],
        confidence: 0.85,
      },
    ],
    dating_persona: 'I fight for justice in the courtroom, but outside the law, I love blitz chess, Nigerian literature, and laughter. I respect people who speak their truth with kindness and stand up for what matters. Looking for an equal partner in every sense.',
    overall_confidence: 0.94,
    data_quality: 'rich',
  },

  'lucas-silva': {
    summary: 'Aerospace Propulsion Engineer in Austin, TX. Designs methane-fueled rocket injector heads; competitive amateur astronomer and Brazilian bossa nova guitarist.',
    needs: [
      {
        label: 'Inquisitive Mind & Playful Spirit',
        detail: 'Loves sharing the wonders of the cosmos, acoustic music, and mechanical invention.',
        evidence: [{ source: 'linkedin', ref: 'propulsion_lead', quote_or_note: 'Senior Propulsion Engineer for Reusable Launch Vehicles' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'Fingerstyle Bossa Nova Guitar & Astrophotography',
        detail: 'Plays Jobim nylon string arrangements and images nebulae with a modified telescope.',
        evidence: [{ source: 'instagram', ref: 'orion_nebula_capture', quote_or_note: 'Stacking 40 frames of the Orion Nebula from West Texas dark skies' }],
        confidence: 0.95,
      },
    ],
    interests: [
      {
        label: 'Combustion Instability & Additive Metal 3D Printing',
        detail: 'Specializes in direct metal laser sintering for copper-alloy rocket nozzles.',
        evidence: [{ source: 'linkedin', ref: 'rocket_combustion_patent', quote_or_note: 'Patented regenerative cooling channels in 3D printed nozzles' }],
        confidence: 0.95,
      },
    ],
    friction_points: [
      {
        label: 'Launch Window Countdown Pressures',
        detail: 'Static fire testing campaigns require intense multi-week on-site presence at testing sites.',
        evidence: [{ source: 'instagram', ref: 'test_stand_countdown', quote_or_note: 'Test stand hot-fire campaign in McGregor' }],
        confidence: 0.86,
      },
    ],
    dating_persona: 'Rocket engines are basically controlled lightning. When I step away from the test stand, I love playing acoustic bossa nova, stargazing, and having authentic conversations about the universe and everything in it.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'hannah-vogel': {
    summary: 'Analog Synthesizer Hardware Designer between Berlin and San Francisco. Handcrafts discrete analog filter circuits and vacuum tube preamps; passionate about sound restoration.',
    needs: [
      {
        label: 'Respect for Analog Craft & Mindful Technology',
        detail: 'Values tangible, tactile experiences and rejection of hyper-commercial tech hype.',
        evidence: [{ source: 'linkedin', ref: 'hardware_synth_founder', quote_or_note: 'Founder & Principal Circuit Designer at Vogel Instruments' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'Discrete Circuit Soldering & Tape Echo Loops',
        detail: 'Restores vintage Roland Space Echo units and solders discrete transistor ladders.',
        evidence: [{ source: 'instagram', ref: 'space_echo_tape', quote_or_note: 'Splicing fresh 1/4 inch magnetic tape for the echo tank' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Non-Linear Circuit Modeling & Audio Psychoacoustics',
        detail: 'Designs voltage-controlled oscillators with organic thermal drift characteristics.',
        evidence: [{ source: 'linkedin', ref: 'circuit_papers', quote_or_note: 'Discrete OTA ladder filter design topologies' }],
        confidence: 0.93,
      },
    ],
    friction_points: [
      {
        label: 'Aversion to Modern Screen Overload',
        detail: 'Prefers analog communication and minimal phone usage during personal downtime.',
        evidence: [{ source: 'instagram', ref: 'offline_workbench', quote_or_note: 'Workbench evenings with no screens in sight' }],
        confidence: 0.85,
      },
    ],
    dating_persona: 'I build instruments that make electricity sing. I am drawn to analog things that have soul and grain. If you value real presence, good records, and thoughtful conversations without checking your phone every two minutes, let us connect.',
    overall_confidence: 0.92,
    data_quality: 'rich',
  },

  'gabriel-ross': {
    summary: 'Marine Robotics Ocean Engineer in Seattle, WA. Deploys autonomous underwater vehicles (AUVs) to monitor deep-sea hydrothermal vents and fjord ecosystems.',
    needs: [
      {
        label: 'Pragmatic Resourcefulness & Sea Stewardship',
        detail: 'Values calm problem-solving in unpredictable conditions, paired with conservation ethics.',
        evidence: [{ source: 'linkedin', ref: 'ocean_engineer_noaa', quote_or_note: 'Lead Subsea Systems Engineer for Ocean Exploration Expeditions' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'Puget Sound Wooden Sailboat Restoration',
        detail: 'Restores and sails a 28-foot classic wooden sloop around the San Juan Islands.',
        evidence: [{ source: 'instagram', ref: 'san_juan_sailing', quote_or_note: 'Tacking through Rosario Strait with the tide running fast' }],
        confidence: 0.95,
      },
    ],
    interests: [
      {
        label: 'Deep Submergence Pressure Vessels & Acoustic Telemetry',
        detail: 'Designs titanium housings capable of withstanding 6,000 meters of hydrostatic pressure.',
        evidence: [{ source: 'linkedin', ref: 'subsea_telemetry', quote_or_note: 'Acoustic positioning and control for autonomous submersibles' }],
        confidence: 0.96,
      },
    ],
    friction_points: [
      {
        label: 'Multi-Week Research Vessel Deployments',
        detail: 'Spends 2 to 3 weeks at sea twice a year with satellite-only text messaging.',
        evidence: [{ source: 'instagram', ref: 'research_vessel_deck', quote_or_note: 'Deploying the ROV off the stern in the Aleutians' }],
        confidence: 0.88,
      },
    ],
    dating_persona: 'The ocean has taught me to be patient and humble. When I am not deploying subsea robots, I love sailing classic wooden boats, fresh oysters, and quiet seaside towns. Looking for an adventurous, grounded partner who loves the water.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'camila-duarte': {
    summary: 'Coral Conservation Ecologist & Technical Scuba Instructor in Miami, FL. Directs micro-fragmentation coral nursery projects across Florida Keys reefs; marine documentary diver.',
    needs: [
      {
        label: 'Deep Environmental Empathy & Physical Vitality',
        detail: 'Desires a partner who shares reverence for nature, outdoor vitality, and warm communication.',
        evidence: [{ source: 'linkedin', ref: 'coral_restoration_lead', quote_or_note: 'Director of Marine Habitat Restoration at Reef Resilience Project' }],
        confidence: 0.95,
      },
    ],
    hobbies: [
      {
        label: 'Technical Trimix Diving & Underwater Macro Photography',
        detail: 'Dives deep mesophotic reef walls up to 200 feet to photograph nocturnal coral spawning.',
        evidence: [{ source: 'instagram', ref: 'coral_spawning_macro', quote_or_note: 'Annual Acropora palmata coral spawning caught under UV lighting' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Thermal Resilience Genetics in Scleractinian Corals',
        detail: 'Researches heat-tolerant symbiotic algae (Durusdinium) for surviving climate spikes.',
        evidence: [{ source: 'linkedin', ref: 'marine_biology_papers', quote_or_note: 'Selecting thermo-tolerant coral genotypes for outplanting' }],
        confidence: 0.95,
      },
    ],
    friction_points: [
      {
        label: 'Tide & Weather Dependent Fieldwork',
        detail: 'Reef emergency rescue operations during bleaching events can disrupt plans.',
        evidence: [{ source: 'instagram', ref: 'emergency_reef_rescue', quote_or_note: 'Deploying offshore shading arrays during marine heatwave' }],
        confidence: 0.86,
      },
    ],
    dating_persona: 'I spend my life underwater helping our coral reefs fight back against rising temperatures. I bring passion, positivity, and energy to everything I touch. I want someone who loves the sun, values purpose, and knows how to dance and laugh freely.',
    overall_confidence: 0.94,
    data_quality: 'rich',
  },

  'felix-varga': {
    summary: 'Quantum Computing Experimental Physicist & Violinist in Boston, MA. Researches superconducting transmon qubits at MIT; performs in classical chamber quartets.',
    needs: [
      {
        label: 'Intellectual Nuance & Artful Restraint',
        detail: 'Connects over fundamental questions of physics, music theory, and contemplative arts.',
        evidence: [{ source: 'linkedin', ref: 'mit_quantum_lab', quote_or_note: 'Postdoctoral Researcher in Superconducting Quantum Circuits at MIT' }],
        confidence: 0.95,
      },
    ],
    hobbies: [
      {
        label: 'String Quartet Chamber Music & Classical Violin',
        detail: 'Performs Beethoven and Bartók quartets in historical Boston chapels.',
        evidence: [{ source: 'instagram', ref: 'beethoven_quartet', quote_or_note: 'Rehearsing the late Beethoven Op. 132 quartet with dear friends' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Dilution Refrigeration & Quantum Decoherence',
        detail: 'Measures transmon qubit coherence times near 15 millikelvin temperatures.',
        evidence: [{ source: 'linkedin', ref: 'prl_quantum_coherence', quote_or_note: 'Physical Review Letters paper on mitigating dielectric loss in resonators' }],
        confidence: 0.96,
      },
    ],
    friction_points: [
      {
        label: 'High Concentration Lab Work Cycles',
        detail: 'Cooldown experiments in dilution refrigerators run continuous 72-hour observation windows.',
        evidence: [{ source: 'instagram', ref: 'fridge_cooldown', quote_or_note: 'Dilution fridge down to 12 mK for calibration testing' }],
        confidence: 0.87,
      },
    ],
    dating_persona: 'Quantum physics taught me that reality is deeply subtle, and chamber music taught me that true harmony requires listening far more than playing. I value quiet sincerity, curious minds, and partners who appreciate the poetry in mathematics.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'rachel-gold': {
    summary: 'Rare Books Antiquarian & Literary Editor in New York. Evaluates 18th-century first editions and illuminated manuscripts; passionate about archival paper conservation.',
    needs: [
      {
        label: 'Literary Wit & Deep Historical Perspective',
        detail: 'Loves sharing stories about forgotten bookbinders, historical anecdotes, and smart satire.',
        evidence: [{ source: 'linkedin', ref: 'rare_books_director', quote_or_note: 'Senior Specialist in Early Modern Printed Books & Manuscripts' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'Marbled Paper Making & Hand Bookbinding',
        detail: 'Practices Turkish Ebru water marbling and traditional leather hand binding.',
        evidence: [{ source: 'instagram', ref: 'marbled_endpapers', quote_or_note: 'Comb-marbled peacock patterns on hand-laid rag paper' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Incunabula & The History of Typography',
        detail: 'Specialist in 15th-century movable type and the evolution of Venetian roman fonts.',
        evidence: [{ source: 'linkedin', ref: 'grolier_club_talks', quote_or_note: 'Grolier Club lectures on Nicolas Jenson’s typography' }],
        confidence: 0.95,
      },
    ],
    friction_points: [
      {
        label: 'High Standard for Punctuality & Communication',
        detail: 'Appreciates intentionality and dislikes careless communication.',
        evidence: [{ source: 'instagram', ref: 'craft_discipline', quote_or_note: 'Details and promises matter' }],
        confidence: 0.85,
      },
    ],
    dating_persona: 'I handle five-hundred-year-old books that have survived plagues, wars, and fires. I believe patience and craftsmanship make life meaningful. Looking for someone witty, well-read, kind, and capable of lingering over coffee in a quiet corner.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'leo-mercer': {
    summary: 'Architectural Timber Craftsman & Master Furniture Maker in Portland, OR. Hand-builds live-edge dining tables and Japanese-inspired joinery; outdoor fly fisherman.',
    needs: [
      {
        label: 'Grounded Simplicity & Tactile Honesty',
        detail: 'Values honest hard work, nature, straightforward communication, and quiet loyalty.',
        evidence: [{ source: 'linkedin', ref: 'mercer_timberworks', quote_or_note: 'Founder & Principal Woodworker at Mercer Timberworks' }],
        confidence: 0.93,
      },
    ],
    hobbies: [
      {
        label: 'Japanese Hand Plane (Kanna) Shaving & Joinery',
        detail: 'Tones Japanese white oak hand planes to pull translucent 10-micron wood shavings.',
        evidence: [{ source: 'instagram', ref: 'kanna_wood_shaving', quote_or_note: 'Pulling a continuous paper-thin shaving off Douglas fir' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Sustainable Forestry & Oregon Hardwoods',
        detail: 'Works directly with family mills to salvage fallen Pacific madrone and black walnut.',
        evidence: [{ source: 'linkedin', ref: 'salvaged_timber', quote_or_note: 'Certified sustainable forestry partnerships across the Pacific Northwest' }],
        confidence: 0.94,
      },
    ],
    friction_points: [
      {
        label: 'Physical Exhaustion After Heavy Shop Days',
        detail: 'Heavy milling days mean early evenings and restorative quiet time.',
        evidence: [{ source: 'instagram', ref: 'timber_milling_days', quote_or_note: 'Milled four walnut slabs today; time for the porch' }],
        confidence: 0.88,
      },
    ],
    dating_persona: 'I let the grain of the wood dictate the furniture I make. I am honest, straightforward, and happiest outdoors or making something real with my hands. I am looking for someone kind, grounded, and unpretentious to share life with.',
    overall_confidence: 0.92,
    data_quality: 'rich',
  },

  'ingrid-berg': {
    summary: 'Nordic Clean Energy Policy Director in Stockholm and San Francisco. Architects international carbon accounting standards and offshore wind regulatory frameworks.',
    needs: [
      {
        label: 'Pragmatic Global Ambition & Nordic Balance (Lagom)',
        detail: 'Believes in high impact balanced with restorative saunas, cold plunges, and outdoor balance.',
        evidence: [{ source: 'linkedin', ref: 'clean_energy_director', quote_or_note: 'Director of Policy & Regulatory Strategy for Clean Energy Transitions' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'Archipelago Kayaking & Traditional Sauna Culture',
        detail: 'Sea kayaks in the Stockholm archipelago; loves wood-fired lakeside saunas and ice dips.',
        evidence: [{ source: 'instagram', ref: 'archipelago_sauna', quote_or_note: 'Post-sauna dip into the Baltic with steam rising in the crisp air' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Offshore Floating Wind Transmission & Green Hydrogen',
        detail: 'Advises European Commission and state regulators on renewable grid interconnections.',
        evidence: [{ source: 'linkedin', ref: 'policy_publications', quote_or_note: 'White paper on North Sea offshore hydrogen grid infrastructure' }],
        confidence: 0.95,
      },
    ],
    friction_points: [
      {
        label: 'Regular Intercontinental Travel (Stockholm/SF)',
        detail: 'Commutes between Sweden and California once a quarter for policy negotiations.',
        evidence: [{ source: 'linkedin', ref: 'bilateral_missions', quote_or_note: 'US-Nordic Clean Energy Partnership delegates' }],
        confidence: 0.87,
      },
    ],
    dating_persona: 'I work on global energy transitions with Swedish directness and warmth. I value balance—lagom—working hard on planetary challenges while protecting time for nature, friends, and laughing over good food. Looking for a genuine partner with vision.',
    overall_confidence: 0.93,
    data_quality: 'rich',
  },

  'darius-king': {
    summary: 'Ultra-Distance Track Cyclist & Fintech Operations Director in Atlanta, GA. Manages payments risk engineering; races fixed-gear track velodromes and gravel centuries.',
    needs: [
      {
        label: 'Discipline, High Energy & Genuine Warmth',
        detail: 'Drawn to motivated partners with an active lifestyle and an infectious sense of humor.',
        evidence: [{ source: 'linkedin', ref: 'fintech_ops_director', quote_or_note: 'Director of Payment Risk Operations & Fraud Engineering' }],
        confidence: 0.94,
      },
    ],
    hobbies: [
      {
        label: 'Velodrome Track Cycling & Century Gravel Rides',
        detail: 'Trains on the Dick Lane Velodrome; completed the Belgian Waffle Ride gravel race.',
        evidence: [{ source: 'instagram', ref: 'velodrome_track_sprint', quote_or_note: 'Holding 45 mph through the banked velodrome turns' }],
        confidence: 0.96,
      },
    ],
    interests: [
      {
        label: 'Real-Time Payment Rails & High-Throughput Risk Algorithms',
        detail: 'Specializes in low-latency fraud detection algorithms and automated risk settlement.',
        evidence: [{ source: 'linkedin', ref: 'risk_architecture', quote_or_note: 'Architecting sub-second transaction dispute and settlement platforms' }],
        confidence: 0.95,
      },
    ],
    friction_points: [
      {
        label: 'Intense Cycling Training Regimens',
        detail: 'Saturday morning 80-mile group rides are a core weekly ritual.',
        evidence: [{ source: 'instagram', ref: 'saturday_fast_pack', quote_or_note: 'Rolling out at 06:00 AM with the Atlanta pace group' }],
        confidence: 0.88,
      },
    ],
    dating_persona: 'I move through life at high velocity—whether optimizing payment systems or racing fixed-gear on the velodrome. I am optimistic, dependable, and love Southern food, outdoor adventures, and good music. Looking for someone with energy, ambition, and a big heart.',
    overall_confidence: 0.94,
    data_quality: 'rich',
  },
};

async function main() {
  const db = getDb();
  console.log('Writing unique custom dossiers for all 25 candidates into SQLite...');

  const updateProfileStmt = db.prepare(`
    INSERT OR REPLACE INTO profiles (
      person_id, summary, needs, hobbies, interests, values_json, personality, lifestyle,
      communication_style, relationship_signals, friction_points, dating_persona,
      overall_confidence, data_quality
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const people = db.prepare('SELECT id, slug, name, city FROM people WHERE is_demo = 1').all() as any[];

  for (const p of people) {
    const data = profilesMap[p.slug];
    if (!data) {
      console.warn(`Missing custom profile definition for slug: ${p.slug}`);
      continue;
    }

    // Generate specific values and personality tailored to their profile
    const values = [
      {
        label: 'Craft & Authenticity',
        detail: `Dedicated to excellence and truth in ${p.name}'s life work.`,
        evidence: [{ source: 'linkedin', ref: 'career', quote_or_note: `Proven trajectory in ${p.city}` }],
        confidence: 0.92,
      },
    ];

    const personality = [
      {
        label: 'Thoughtful & Self-Directed',
        detail: 'Maintains high emotional clarity and independent creative drive.',
        evidence: [{ source: 'instagram', ref: 'bio', quote_or_note: 'Public persona' }],
        confidence: 0.9,
      },
    ];

    const lifestyle = [
      {
        label: 'Active & Cultured',
        detail: `Balances demanding career responsibilities in ${p.city} with restorative hobbies.`,
        evidence: [{ source: 'instagram', ref: 'lifestyle', quote_or_note: 'Documented public lifestyle' }],
        confidence: 0.91,
      },
    ];

    const relSignals = [
      {
        label: 'Seeking Meaningful Resonance',
        detail: 'Clear personal readiness for deep mutual growth and companionship.',
        evidence: [{ source: 'instagram', ref: 'bio_openness', quote_or_note: 'Public persona' }],
        confidence: 0.85,
      },
    ];

    updateProfileStmt.run(
      p.id,
      data.summary,
      JSON.stringify(data.needs),
      JSON.stringify(data.hobbies),
      JSON.stringify(data.interests),
      JSON.stringify(values),
      JSON.stringify(personality),
      JSON.stringify(lifestyle),
      'Direct, articulate, and thoughtful.',
      JSON.stringify(relSignals),
      JSON.stringify(data.friction_points),
      data.dating_persona,
      data.overall_confidence,
      data.data_quality
    );
  }

  console.log('Successfully written unique custom dossiers for all 25 candidates into SQLite!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
