export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  focalPoint?: string;
};

export type ProjectVisualMode = 'landscape' | 'courtyard' | 'interior' | 'vertical' | 'campus';
export type SectionMotion = 'wipe' | 'split' | 'stack' | 'focus';

export type ProjectSection = {
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  images: ProjectImage[];
  layout: 'split' | 'wide' | 'gallery' | 'diagram';
  motion: SectionMotion;
};

export type Project = {
  slug: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  location?: string;
  client?: string;
  lead: string;
  description: string;
  tags: string[];
  visualMode: ProjectVisualMode;
  hero: ProjectImage;
  sections: ProjectSection[];
};

export type ContactInfo = {
  email: string;
  phones: string[];
};

const assetDimensions: Record<string, [number, number]> = {
  cover: [893, 1263],
  'cultural-hub-analysis': [1786, 1263],
  'cultural-hub-hero-v2': [2200, 1558],
  'cultural-hub-plans': [1786, 1263],
  'cultural-hub-sections': [1786, 1263],
  'cultural-hub-visuals': [1786, 1263],
  'highrise-hero': [1786, 1263],
  'highrise-hero-v2': [1024, 1536],
  'highrise-plans': [1786, 1263],
  'highrise-structure': [1786, 1263],
  'interior-detail': [1786, 1263],
  'interior-hero-v2': [2200, 1137],
  profile: [896, 896],
  'thesis-detail': [1786, 1263],
  'thesis-hero-v2': [2200, 1557],
  'thesis-plan': [1786, 1263],
  'thesis-process': [1786, 1263],
  'thesis-visuals': [1786, 1263],
  'youth-drawings': [1786, 1263],
  'youth-hero-v2': [1194, 844],
};

const image = (src: string, alt: string, caption?: string, focalPoint = '50% 50%'): ProjectImage => {
  const [width, height] = assetDimensions[src];
  return { src: `/assets/portfolio/${src}.webp`, alt, width, height, caption, focalPoint };
};

export const contact: ContactInfo = {
  email: 'mahparamaisha0@gmail.com',
  phones: ['+880 177 645 0288', '+880 153 763 5389'],
};

export const portfolioCover = image('cover', 'The cover of Maisha Mahpara\'s architecture portfolio.', 'Portfolio cover');
export const portrait = image('profile', 'Portrait of Maisha Mahpara seated in a garden.', 'Maisha Mahpara');

export const profile = {
  title: 'I look at people, culture, climate, and daily life before I draw the building.',
  body: 'I start with site analysis, cultural practice, climate, and the everyday activities a project needs to support. In Rangamati, I studied indigenous built forms and cultural infrastructure. In Medley, I translated learn, foster, and exhibit into a public cultural hub. In Empower, I turned locally demanded skills into classrooms, workshops, and accommodation.',
  close: 'I am an architecture graduate from RUET. I work across conceptual design, visualization, 3D modeling, architectural photography, and graphic design.',
};

export const tools = ['AutoCAD', 'SketchUp', 'D5', 'Lumion', 'Photoshop', 'Illustrator', 'InDesign'];

export const projects: Project[] = [
  {
    slug: 'thesis',
    number: '01',
    category: 'Thesis',
    title: 'Rejuvenating Cultural Roots',
    subtitle: 'Ethnic Cultural Institute, Rangamati',
    location: 'Rangamati',
    lead: 'I developed an Ethnic Cultural Institute in Rangamati for cultural learning, practice, performance, and exchange.',
    description: 'I studied how cultural values, environmental adaptation, and everyday practices shape indigenous built forms in the Chittagong Hill Tracts. My proposal brings together spaces for learning, practice, research, performance, and cultural exchange through a contemporary, culturally grounded institute.',
    tags: ['Research', 'Cultural infrastructure', 'Community'],
    visualMode: 'landscape',
    hero: image('thesis-hero-v2', 'A timber and thatch cultural institute set in a green landscape with stepped seating and a pavilion.', 'View of the institute pavilions, landscape, and stepped gathering area.'),
    sections: [
      {
        id: 'question',
        eyebrow: 'The question',
        title: 'How can architecture hold a culture that is still living?',
        body: 'I began with ethnographic research, field surveys, and community engagement. Rangamati is home to twelve indigenous communities whose cultural identity is under pressure from inadequate infrastructure and dominant mainstream influences, so I framed the project before making a formal proposal.',
        images: [image('thesis-process', 'A thesis spread showing site analysis, problem framing, project aims, and cultural research.')],
        layout: 'wide',
        motion: 'wipe',
      },
      {
        id: 'landscape',
        eyebrow: 'Reading the place',
        title: 'Masterplan and settlement analysis',
        body: 'I arranged the museum, academy, dormitory, shops, pavilions, and gathering spaces around the site, connecting cultural programs through a shared landscape and movement system.',
        images: [image('thesis-plan', 'A masterplan and site strategy spread for the Ethnic Cultural Institute.')],
        layout: 'diagram',
        motion: 'stack',
      },
      {
        id: 'details',
        eyebrow: 'Making space',
        title: 'Material and structural details',
        body: 'I developed material and structural details for the museum, dormitory, restaurant, and academy, including the roof, circulation, and elevated building elements shown in the drawings.',
        images: [image('thesis-detail', 'Sections and material details for museum, dormitory, restaurant, and academy spaces.')],
        layout: 'wide',
        motion: 'split',
      },
      {
        id: 'in-use',
        eyebrow: 'In use',
        title: 'The institute in use',
        body: 'I designed the institute as a sequence of public spaces: an entry pavilion, exhibition space, ethnic shops, academy circulation, dormitory, museum block, and Biju Ghat.',
        images: [
          image('thesis-visuals', 'A collage of visualizations showing the museum, dormitory, academy pavilion, entry pavilion, ethnic shops, exhibition space, and Biju Ghat.'),
          image('thesis-hero-v2', 'A landscape view of the institute with a stepped amphitheatre and open pavilion.'),
        ],
        layout: 'gallery',
        motion: 'focus',
      },
    ],
  },
  {
    slug: 'cultural-hub',
    number: '02',
    category: 'Cultural Hub',
    title: 'Medley',
    subtitle: 'A Multi-Cultural Hub, Khulshi',
    location: 'Khulshi, Chittagong',
    lead: 'I designed Medley as a multi-cultural hub where learning, exhibition, performance, and everyday public life overlap.',
    description: 'I brought academy spaces, performance venues, and interactive art spaces together in an open cultural complex. My aim was to make cultural participation part of daily life in Khulshi rather than something reserved for occasional events.',
    tags: ['Culture', 'Education', 'Performance'],
    visualMode: 'courtyard',
    hero: image('cultural-hub-hero-v2', 'A cultural complex with curved white volumes, a public courtyard, and a green roofscape.', 'Medley brings learning, performance, exhibition, and gathering into one open cultural complex.'),
    sections: [
      {
        id: 'oasis',
        eyebrow: 'The premise',
        title: 'Open every day',
        body: 'I framed culture as a daily exchange rather than an occasional event. Learn, foster, and exhibit became three overlapping public actions that structure the building and its landscape.',
        images: [image('cultural-hub-analysis', 'A cultural hub spread showing site analysis, concept diagrams, and the open-every-day strategy.')],
        layout: 'wide',
        motion: 'focus',
      },
      {
        id: 'levels',
        eyebrow: 'Spatial sequence',
        title: 'Floor plans for the cultural hub',
        body: 'I organized the cultural academy, performance, exhibition, and gathering programs across the floor plans shown for Medley.',
        images: [image('cultural-hub-plans', 'Ground, first, and second floor plans for Medley.')],
        layout: 'diagram',
        motion: 'split',
      },
      {
        id: 'section',
        eyebrow: 'Section',
        title: 'Sections, elevations, and courtyard',
        body: 'I used sections and elevations to study the cultural hub, its courtyard, and the relationship between the academy, performance spaces, and public circulation.',
        images: [image('cultural-hub-sections', 'Sections and elevations of Medley, including the central courtyard.')],
        layout: 'wide',
        motion: 'wipe',
      },
      {
        id: 'public-life',
        eyebrow: 'Public life',
        title: 'Visualizations of public life',
        body: 'I studied the entrance, courtyard, academy, circulation, and gathering spaces through the project visualizations.',
        images: [image('cultural-hub-visuals', 'A visual collage of the cultural hub entrance, courtyard, academy, and circulation spaces.')],
        layout: 'gallery',
        motion: 'focus',
      },
    ],
  },
  {
    slug: 'interior',
    number: '03',
    category: 'Interior',
    title: 'Music Bistro',
    subtitle: 'Where melody and flavour converge',
    lead: 'I designed Music Bistro as a warm, intimate room where cafe culture and live performance share the same space.',
    description: 'I planned the bistro for acoustic sessions, jazz nights, open mic sessions, and the quieter rituals around food and conversation. I used material warmth and furniture detail to hold both focus and informality.',
    tags: ['Interior', 'Hospitality', 'Live music'],
    visualMode: 'interior',
    hero: image('interior-hero-v2', 'A warm brick and timber interior of Music Bistro with a small live music stage.', 'A room tuned for both music and conversation.'),
    sections: [
      {
        id: 'atmosphere',
        eyebrow: 'Atmosphere',
        title: 'Furniture detail and atmosphere',
        body: 'I developed furniture details for a bistro that combines a cafe atmosphere with acoustic sessions, jazz nights, open mic sessions, and other live music events.',
        images: [image('interior-detail', 'Furniture and interior detail drawings for Music Bistro.')],
        layout: 'wide',
        motion: 'focus',
      },
    ],
  },
  {
    slug: 'highrise',
    number: '04',
    category: 'Highrise',
    title: 'Design of a Living Skyscraper',
    subtitle: 'An icon for the emerging economy',
    location: 'New Delhi, India',
    client: 'Reliance',
    lead: 'I organized a mixed-use vertical hub integrating retail, corporate, hospitality, and public life.',
    description: 'I combined a shopping mall, cineplex, food court, rentable offices, corporate headquarters, banks, banquet halls, hotels, and restaurants into a vertical urban destination. The study considers New Delhi\'s hot-dry climate, wind, air pollution, water pollution, and loss of flora and fauna.',
    tags: ['Mixed use', 'Climate', 'Diagrid'],
    visualMode: 'vertical',
    hero: image('highrise-hero-v2', 'A diagrid highrise rising from a mixed-use podium in New Delhi.', 'A mixed-use highrise with a shopping mall podium and a multi-program tower.'),
    sections: [
      {
        id: 'climate',
        eyebrow: 'Climate and program',
        title: 'A vertical mix of public and private life',
        body: 'I began with climate, pollution, wind, and program, then organized the tower as a vertical zoning diagram for retail, offices, hospitality, and public functions.',
        images: [image('highrise-hero', 'A highrise analysis spread showing climate, site, environmental aims, and vertical zoning.')],
        layout: 'wide',
        motion: 'wipe',
      },
      {
        id: 'stack',
        eyebrow: 'Vertical zoning',
        title: 'Vertical zoning and floor plans',
        body: 'I stacked retail, offices, hotel, mechanical zones, and public functions into a clear vertical sequence across the ground, bank, corporate office, hotel, and typical floor plans.',
        images: [image('highrise-plans', 'Ground, bank, corporate office, hotel, and typical floor plans for the skyscraper.')],
        layout: 'diagram',
        motion: 'stack',
      },
      {
        id: 'structure',
        eyebrow: 'Structure',
        title: 'Diagrid, mega columns, and skeleton slab',
        body: 'I studied a structural system of diagrid and mega columns, alongside the skeleton slab model shown in the structural drawings.',
        images: [image('highrise-structure', 'Section, elevation, diagrid structural system, and skeleton slab model.')],
        layout: 'wide',
        motion: 'split',
      },
    ],
  },
  {
    slug: 'youth-center',
    number: '05',
    category: 'Youth Center',
    title: 'Empower',
    subtitle: 'A skill development center for the youth',
    location: 'Rajshahi and Chapainawabganj',
    lead: 'I designed Empower as a context-based campus for practical education, shared learning, and youth development.',
    description: 'I translated locally demanded skills into classrooms, language labs, computer facilities, and hands-on workshops for wood and civil works. I organized learning, living, and training as an accessible and adaptable campus with on-site accommodation.',
    tags: ['Education', 'Workshops', 'Accommodation'],
    visualMode: 'campus',
    hero: image('youth-hero-v2', 'An educational campus composed of low-rise buildings, planted courtyards, and shaded paths.', 'A campus organized around practical education, workshops, and accommodation.'),
    sections: [
      {
        id: 'framework',
        eyebrow: 'The framework',
        title: 'Learning, living, making',
        body: 'I gave practical education a spatial identity. Workshops, classrooms, language labs, computers, and accommodation are connected by shared outdoor spaces and clear circulation.',
        images: [image('youth-drawings', 'Concept, floor plan, north-west elevation, and section for Empower.')],
        layout: 'wide',
        motion: 'stack',
      },
    ],
  },
];
