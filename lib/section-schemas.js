// ── Section form schemas ───────────────────────────────────────
//
// Declarative registry that drives the admin SectionFormBuilder.
// Each entry maps a `section.type` to a labelled set of editable fields.
//
// Field shape:
//   {
//     key:      'fieldName',          // key within the storage location
//     label:    'Human Label',
//     type:     'text' | 'textarea' | 'number' | 'toggle' | 'select'
//               | 'image' | 'imagelist' | 'list' | 'stringlist',
//     column:   'title' | undefined,  // if set, reads/writes a top-level column
//     group:    'custom_json' | undefined, // if set, lives inside custom_json
//     options:  ['a','b'] | undefined,// for `select`
//     placeholder, help, required,    // cosmetic / validation hints
//     itemFields: [{ key, type, ... }] // for `list` (repeatable group)
//   }
//
// Two storage locations are supported, matching how every existing renderer
// already reads data:
//   - column:     writes to section.title / subtitle / description / content
//                 / images / buttons / layout / is_visible
//   - group 'custom_json': writes to section.custom_json[key]
//
// `stringlist` is a convenience for a repeatable list of plain strings
// (used by detailed-services features). `list` is a repeatable group.

// Icon names exposed in `select` icon pickers. Union of the lucide icons
// already imported across the section renderers, so the seeded values match
// the lookup maps in each component.
export const ICON_OPTIONS = [
  'CheckCircle2', 'Shield', 'Heart', 'Award', 'Users', 'Clock', 'Star', 'Home',
  'Utensils', 'Bed', 'Sofa', 'PencilRuler', 'KeyRound', 'Hammer',
  'ClipboardList', 'Palette', 'ShieldCheck', 'Headphones', 'Truck', 'Wrench',
  'PaintBucket', 'Ruler', 'Lamp', 'BookOpen', 'ArrowRight', 'ArrowUpRight',
  'Layers', 'Lightbulb', 'Paintbrush', 'Blocks', 'MapPin', 'Phone', 'Mail',
]

// Reusable layout + variant option sets.
const LAYOUT_OPTIONS = ['full-width', 'split', 'grid']

// Common "heading trio" — title (column) + subtitle (column) + description (column).
// Sections that need these repeat the literal to keep each schema self-describing.
const headingFields = (titlePlaceholder = 'Section heading') => [
  { key: 'title', label: 'Heading', type: 'text', column: 'title', placeholder: titlePlaceholder, required: true },
  { key: 'subtitle', label: 'Eyebrow / Tagline', type: 'text', column: 'subtitle', placeholder: 'Small gold label above heading' },
  { key: 'description', label: 'Intro paragraph', type: 'textarea', column: 'description', placeholder: 'Lead-in copy shown under the heading' },
]

// ── Per-type schemas ───────────────────────────────────────────
export const SECTION_SCHEMAS = {
  hero: {
    name: 'Hero Section',
    description: 'Page banner with heading, optional accent line, and lead form or split image.',
    fields: [
      { key: 'title', label: 'Heading', type: 'text', column: 'title', placeholder: 'e.g. Transform Your Home into a', required: true },
      { key: 'titleAccent', label: 'Gold accent line', type: 'text', group: 'custom_json', placeholder: 'e.g. Dream Space.', help: 'Rendered in gold italic on a new line. Leave blank for none.' },
      { key: 'subtitle', label: 'Eyebrow tag', type: 'text', column: 'subtitle', placeholder: 'e.g. Luxury Turnkey Interiors' },
      { key: 'description', label: 'Subheading paragraph', type: 'textarea', column: 'description' },
      {
        key: 'layout', label: 'Layout', type: 'select', column: 'layout',
        options: LAYOUT_OPTIONS, help: 'Use "split" for about-style (image right). Default is full-bleed.'
      },
      { key: 'showLeadForm', label: 'Show inline lead form (right column)', type: 'toggle', group: 'custom_json' },
      { key: 'images', label: 'Background image', type: 'imagelist', help: 'First image is used as the background / split visual.' },
      {
        key: 'buttons', label: 'Action buttons', type: 'list',
        itemFields: [
          { key: 'text', label: 'Label', type: 'text', placeholder: 'Book Free Consultation' },
          { key: 'link', label: 'Link', type: 'text', placeholder: '/contact or #consultation' },
        ],
      },
    ],
  },

  stats: {
    name: 'Stats / Trust Indicators',
    description: 'Row of animated count-up trust indicators.',
    fields: [
      ...headingFields(),
      {
        key: 'items', label: 'Stat items', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'value', label: 'Number', type: 'number', placeholder: '500' },
          { key: 'suffix', label: 'Suffix', type: 'text', placeholder: '+ or %' },
          { key: 'label', label: 'Label', type: 'text', placeholder: 'Homes Delivered' },
          { key: 'subtext', label: 'Subtext', type: 'text', placeholder: 'Exquisite designs across AP' },
          { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
        ],
      },
    ],
  },

  'services-preview': {
    name: 'Services Preview Grid',
    description: '4-column icon card grid (home page).',
    fields: [
      ...headingFields('Services We Specialize In'),
      { key: 'viewAllLink', label: '"View All" link', type: 'text', group: 'custom_json', placeholder: '/services' },
      {
        key: 'items', label: 'Service cards', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Modular Kitchen' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
          { key: 'href', label: 'Link', type: 'text', placeholder: '/services/modular-kitchen' },
        ],
      },
    ],
  },

  'process-timeline': {
    name: 'Process Timeline',
    description: '5-step "How it works" timeline plus optional highlight row.',
    fields: [
      ...headingFields('Our Seamless Design Process'),
      {
        key: 'steps', label: 'Timeline steps', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'step', label: 'Step number', type: 'text', placeholder: '01' },
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Consultation' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
        ],
      },
      {
        key: 'highlights', label: 'Highlight features row', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'On-Time Delivery' },
          { key: 'desc', label: 'Description', type: 'text', placeholder: 'Projects delivered as promised' },
          { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
        ],
      },
    ],
  },

  'before-after': {
    name: 'Before / After Slider',
    description: 'Comparison slider. images[0] = before, images[1] = after.',
    fields: [
      ...headingFields('Witness the Difference'),
      { key: 'images', label: 'Images (exactly 2)', type: 'imagelist', help: 'Upload/paste exactly two images: first = before, second = after.' },
      { key: 'beforeLabel', label: 'Before label', type: 'text', group: 'custom_json', placeholder: 'Before' },
      { key: 'afterLabel', label: 'After label', type: 'text', group: 'custom_json', placeholder: 'After' },
    ],
  },

  'room-designs': {
    name: 'Room-wise Designs',
    description: '3-column room image cards linking to the portfolio filter.',
    fields: [
      ...headingFields('Room-wise Inspirations'),
      {
        key: 'items', label: 'Room cards', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'name', label: 'Room name', type: 'text', placeholder: 'Kitchen' },
          { key: 'image', label: 'Image URL', type: 'image' },
          { key: 'filter', label: 'Portfolio filter', type: 'text', placeholder: 'Kitchen' },
          { key: 'tag', label: 'Tag', type: 'text', placeholder: 'Culinary Hubs' },
        ],
      },
    ],
  },

  'featured-projects': {
    name: 'Featured Projects',
    description: '3-column highlight project cards.',
    fields: [
      ...headingFields('Selected Creations'),
      { key: 'viewAllLink', label: '"View All" link', type: 'text', group: 'custom_json', placeholder: '/portfolio' },
      {
        key: 'items', label: 'Project cards', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Modern Wood Kitchen & Island' },
          { key: 'type', label: 'Type tag', type: 'text', placeholder: 'Modular Kitchen' },
          { key: 'budget', label: 'Budget', type: 'text', placeholder: '₹8.5 Lakhs' },
          { key: 'category', label: 'Portfolio category', type: 'text', placeholder: 'Kitchen' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'image', label: 'Image URL', type: 'image' },
        ],
      },
    ],
  },

  testimonials: {
    name: 'Testimonials',
    description: 'Heading chrome wrapping the live Google reviews carousel.',
    fields: headingFields('What Our Clients Say'),
  },

  'why-choose': {
    name: 'Why Choose Us',
    description: 'Shared WhyChooseHayagriva block. Heading + variant editable.',
    fields: [
      { key: 'title', label: 'Heading', type: 'text', column: 'title', placeholder: 'Why Homeowners Trust Hayagriva', required: true },
      { key: 'variant', label: 'Variant', type: 'select', group: 'custom_json', options: ['light', 'dark'] },
    ],
  },

  faq: {
    name: 'FAQ Accordion',
    description: 'Heading + list of question/answer pairs (feeds FAQ JSON-LD).',
    fields: [
      { key: 'title', label: 'Heading', type: 'text', column: 'title', placeholder: 'Your Interior Design Questions, Answered', required: true },
      {
        key: 'items', label: 'FAQ items', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'question', label: 'Question', type: 'text', required: true },
          { key: 'answer', label: 'Answer', type: 'textarea', required: true },
        ],
      },
    ],
  },

  cta: {
    name: 'CTA Banner',
    description: 'Call-to-action band. Use variant "rounded" for inset cards.',
    fields: [
      ...headingFields('Ready to Transform Your Space?'),
      { key: 'variant', label: 'Variant', type: 'select', group: 'custom_json', options: ['full', 'rounded'] },
      { key: 'images', label: 'Background image (optional)', type: 'imagelist', help: 'First image used as faint background in "full" variant.' },
      {
        key: 'buttons', label: 'Action buttons', type: 'list',
        itemFields: [
          { key: 'text', label: 'Label', type: 'text', placeholder: 'Get Free Quote' },
          { key: 'link', label: 'Link', type: 'text', placeholder: '/contact' },
        ],
      },
    ],
  },

  'design-journal': {
    name: 'Design Journal / Blog',
    description: '3-column blog teaser grid.',
    fields: [
      ...headingFields('Design Journal'),
      {
        key: 'items', label: 'Blog posts', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'category', label: 'Category', type: 'text', placeholder: 'Aesthetics' },
          { key: 'date', label: 'Date', type: 'text', placeholder: 'June 12, 2026' },
          { key: 'slug', label: 'Slug', type: 'text', placeholder: 'art-of-japandi' },
          { key: 'desc', label: 'Excerpt', type: 'textarea' },
          { key: 'image', label: 'Image URL', type: 'image' },
        ],
      },
    ],
  },

  'about-story': {
    name: 'About / Our Story',
    description: 'Two-column narrative + value cards. Separate paragraphs with a blank line.',
    fields: [
      { key: 'subtitle', label: 'Eyebrow tag', type: 'text', column: 'subtitle' },
      { key: 'title', label: 'Heading', type: 'text', column: 'title', required: true },
      { key: 'content', label: 'Narrative (separate paragraphs with a blank line)', type: 'textarea', column: 'content', help: 'Split on blank lines into multiple <p> tags.' },
      {
        key: 'cards', label: 'Value cards', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'label', label: 'Eyebrow', type: 'text', placeholder: 'Mission' },
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'body', label: 'Body', type: 'textarea' },
        ],
      },
    ],
  },

  'services-grid': {
    name: 'Services Grid (Portfolio Cards)',
    description: '4-column image card grid for the services overview.',
    fields: [
      ...headingFields(),
      {
        key: 'items', label: 'Service cards', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'slug', label: 'Slug', type: 'text', placeholder: 'modular-kitchen' },
          { key: 'filter', label: 'Show "Bespoke" badge', type: 'toggle' },
          { key: 'image', label: 'Image URL', type: 'image' },
        ],
      },
    ],
  },

  'detailed-services': {
    name: 'Detailed Services (Alternating)',
    description: 'Alternating image/text rows with a feature checklist.',
    fields: [
      ...headingFields(),
      {
        key: 'items', label: 'Service rows', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'tag', label: 'Eyebrow tag', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'image', label: 'Image URL', type: 'image' },
          { key: 'features', label: 'Features', type: 'stringlist', placeholder: 'Premium soft-close hardware' },
        ],
      },
    ],
  },

  pricing: {
    name: 'Pricing Guide',
    description: '3-column starting-price cards.',
    fields: [
      ...headingFields(),
      {
        key: 'items', label: 'Price cards', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Modular Kitchen' },
          { key: 'range', label: 'Price range', type: 'text', placeholder: '₹1.5L – ₹5L' },
          { key: 'desc', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },

  contact: {
    name: 'Contact Split Layout',
    description: 'Contact info card + form. Address/phone/email come from the list below.',
    fields: [
      ...headingFields('Contact Us'),
      { key: 'intro', label: 'Intro paragraph', type: 'textarea', group: 'custom_json', placeholder: 'Drop by our studio for a cup of coffee…' },
      { key: 'mapUrl', label: 'Google Maps link', type: 'text', group: 'custom_json', placeholder: 'https://www.google.com/maps/search/?api=1&query=…' },
      {
        key: 'contactItems', label: 'Contact info items', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'icon', label: 'Icon', type: 'select', options: ['MapPin', 'Phone', 'Mail', 'Clock'] },
          { key: 'label', label: 'Label', type: 'text', placeholder: 'Our Studio' },
          { key: 'value', label: 'Value', type: 'textarea', placeholder: 'Full address or phone…' },
          { key: 'href', label: 'Link (optional)', type: 'text', placeholder: 'tel:+91… or mailto:…' },
          { key: 'subtext', label: 'Subtext (optional)', type: 'text', placeholder: 'Mon–Sat, 9:30 AM – 7:00 PM' },
        ],
      },
    ],
  },

  'portfolio-grid': {
    name: 'Portfolio Grid (Filters)',
    description: 'Interactive category-filter project grid. Pulls projects live from the projects table.',
    fields: [
      { key: 'categories', label: 'Filter categories', type: 'stringlist', group: 'custom_json', placeholder: 'Kitchen' },
    ],
  },

  'craft-standards': {
    name: 'Craft / Studio Standards',
    description: '3-column craftsmanship/quality cards.',
    fields: [
      ...headingFields(),
      {
        key: 'items', label: 'Standard cards', type: 'list', group: 'custom_json',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text', placeholder: 'Precision Joinery' },
          { key: 'desc', label: 'Description', type: 'textarea' },
          { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
        ],
      },
    ],
  },

  custom: {
    name: 'Custom Section',
    description: 'Generic section rendered by the fallback renderer.',
    fields: [
      ...headingFields(),
      { key: 'content', label: 'Content body', type: 'textarea', column: 'content' },
      { key: 'layout', label: 'Layout', type: 'select', column: 'layout', options: LAYOUT_OPTIONS },
      { key: 'images', label: 'Images', type: 'imagelist' },
      {
        key: 'buttons', label: 'Action buttons', type: 'list',
        itemFields: [
          { key: 'text', label: 'Label', type: 'text' },
          { key: 'link', label: 'Link', type: 'text' },
        ],
      },
    ],
  },
}

// Labels for the type <select> in the editor (matches existing dashboard list).
export const SECTION_TYPE_OPTIONS = Object.entries(SECTION_SCHEMAS).map(([type, s]) => ({
  value: type,
  label: s.name,
}))

// ── Default empty document for a given type ────────────────────
// Used when "Add Section" opens the drawer or when the type changes,
// so the form starts with sane empty arrays/objects rather than undefined.
export function defaultSectionData(type) {
  const schema = SECTION_SCHEMAS[type]
  const doc = {
    type,
    title: '',
    subtitle: '',
    description: '',
    content: '',
    layout: 'full-width',
    images: [],
    buttons: [],
    custom_json: {},
    is_visible: true,
  }
  if (!schema) return doc

  for (const field of schema.fields) {
    if (field.type === 'list' && field.group === 'custom_json') {
      doc.custom_json[field.key] = []
    } else if (field.type === 'stringlist' && field.group === 'custom_json') {
      doc.custom_json[field.key] = []
    } else if ((field.type === 'toggle') && field.group === 'custom_json') {
      doc.custom_json[field.key] = false
    } else if (field.type === 'select' && field.group === 'custom_json' && field.options) {
      doc.custom_json[field.key] = field.options[0]
    }
  }
  return doc
}
