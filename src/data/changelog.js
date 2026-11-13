/**
 * CreatorEDF Changelog & Update History
 * Maintained in chronological order (newest first).
 * Only genuine completed website features and releases are documented here.
 */

export const changelogEntries = [
  {
    version: "v2.5.0",
    date: "November 13, 2026",
    title: "EDF Education & Submission Guide + Interactive Next Step Finder",
    category: "Regulatory & Education",
    tagColor: "teal",
    description: "Added a comprehensive, beginner-friendly EDF Education & Submission Guide explaining RBI Form EDF, export classification, DTA vs SEZ authorities, and deemed submission conditions under RBI Notification (FEMA Export of Goods and Services Regulations). Included an interactive 'Find My Next Step' diagnostic tool and regulatory citations.",
    highlights: [
      "Bilingual explanation (English & Hindi) of Form EDF and export realization",
      "5-Step Submission Guide covering software vs non-software export authorities",
      "Interactive 'Find My Next Step' wizard with custom bank questioning checklist",
      "Official RBI Notification reference citations and last-reviewed tracking"
    ]
  },
  {
    version: "v2.4.0",
    date: "November 13, 2026",
    title: "4K Ultra-HD Studio Finish & In-Browser Cookie Privacy Toast",
    category: "Design & UX",
    tagColor: "navy",
    description: "Upgraded the visual architecture to a 4K Ultra-HD studio aesthetic with subpixel font smoothing, ambient glow lighting, micro-grid backdrop, and multi-tier depth shadows. Converted top alert into a sleek floating in-browser privacy cookie toast.",
    highlights: [
      "Subpixel text antialiasing with refined letter tracking (-0.025em)",
      "Ambient teal mesh glow and 24px micro-grid background textures",
      "Persistent bottom-right privacy notice with local storage acknowledgment",
      "Cleaned top navigation and streamlined Indian language selector in navbar"
    ]
  },
  {
    version: "v2.3.0",
    date: "November 13, 2026",
    title: "Original 3D Visual Assets Integration",
    category: "Visual Identity",
    tagColor: "teal",
    description: "Replaced flat placeholder cards with 10 custom 3D isometric visuals illustrating document workspaces, RBI EDF forms, export invoices, AD code letters, and compliance manuals.",
    highlights: [
      "Integrated 3D assets across homepage, generator tabs, downloads, and guides",
      "Strict brand palette adherence: Teal #14B8A6, Deep Navy #0F172A, and Slate",
      "Eliminated generic stock graphics and clip art entirely"
    ]
  },
  {
    version: "v2.2.0",
    date: "November 12, 2026",
    title: "Comprehensive 10 Indian Languages Localization",
    category: "Localization",
    tagColor: "navy",
    description: "Added native UI translations across 10 major Indian languages (Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, and English) to empower creators across India.",
    highlights: [
      "Full UI string translations across navigation, hero, and tool cards",
      "Modular dictionary structure allowing future language expansions",
      "Persistent language preference via browser storage"
    ]
  },
  {
    version: "v2.1.0",
    date: "November 12, 2026",
    title: "Zero Demo Data & Client-Side Privacy Sandbox",
    category: "Privacy & Security",
    tagColor: "teal",
    description: "Purged all mock revenue, sample bank details, and fake client records. Forms start 100% clean and blank. Exporter profiles are stored exclusively inside the user's browser via IndexedDB.",
    highlights: [
      "No default pre-filled sample bank accounts or PAN cards",
      "100% client-side memory execution — no server-side database",
      "Zero telemetry or tracking of sensitive financial earnings"
    ]
  },
  {
    version: "v2.0.0",
    date: "November 11, 2026",
    title: "Unified 3-in-1 Document Generation & ZIP Bundling",
    category: "Document Generator",
    tagColor: "navy",
    description: "Engineered single-click generation for RBI Form EDF Annexure, GST Rule 46/96A Export Invoice, and Bank AD Code Request Letter with client-side jsPDF and ZIP archiving.",
    highlights: [
      "Automatic LUT zero-rated GST export legal declarations",
      "Client-side JSZip packaging of all three PDF compliance files",
      "Compliant currency conversion from foreign wire payouts to INR"
    ]
  }
];
