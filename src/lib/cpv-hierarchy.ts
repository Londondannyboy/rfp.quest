/**
 * CPV (Common Procurement Vocabulary) Hierarchy
 *
 * Structure: Division (2 digits) -> Group (3 digits) -> Class (4 digits)
 *
 * This module provides a hierarchical view of CPV codes for filtering.
 * We focus on the most relevant divisions for UK public procurement.
 */

export interface CpvNode {
  code: string;
  label: string;
  description?: string;
  children?: CpvNode[];
}

export interface CpvDivision {
  code: string;
  label: string;
  icon?: string;
  color?: string;
  children: CpvGroup[];
}

export interface CpvGroup {
  code: string;
  label: string;
  children?: CpvClass[];
}

export interface CpvClass {
  code: string;
  label: string;
}

/**
 * Main CPV divisions relevant to UK public sector
 */
export const CPV_HIERARCHY: CpvDivision[] = [
  {
    code: '45',
    label: 'Construction',
    icon: '🏗️',
    color: 'orange',
    children: [
      {
        code: '451',
        label: 'Site preparation',
        children: [
          { code: '4511', label: 'Demolition work' },
          { code: '4512', label: 'Earth moving' },
        ],
      },
      {
        code: '452',
        label: 'Building construction',
        children: [
          { code: '4521', label: 'General building construction' },
          { code: '4522', label: 'Roof works' },
          { code: '4523', label: 'Highway construction' },
        ],
      },
      {
        code: '453',
        label: 'Building installation',
        children: [
          { code: '4531', label: 'Electrical installation' },
          { code: '4533', label: 'Plumbing installation' },
        ],
      },
      {
        code: '454',
        label: 'Building completion',
        children: [
          { code: '4541', label: 'Plastering work' },
          { code: '4542', label: 'Joinery installation' },
          { code: '4544', label: 'Glazing work' },
        ],
      },
    ],
  },
  {
    code: '48',
    label: 'Software & IT Systems',
    icon: '💻',
    color: 'blue',
    children: [
      {
        code: '481',
        label: 'Package software',
        children: [
          { code: '4810', label: 'Software packages' },
        ],
      },
      {
        code: '482',
        label: 'Development software',
        children: [
          { code: '4821', label: 'Operating systems' },
          { code: '4822', label: 'Development tools' },
        ],
      },
      {
        code: '483',
        label: 'Information systems',
        children: [
          { code: '4831', label: 'Database software' },
          { code: '4832', label: 'Data management' },
        ],
      },
    ],
  },
  {
    code: '72',
    label: 'IT Services',
    icon: '🖥️',
    color: 'violet',
    children: [
      {
        code: '721',
        label: 'Consultancy services',
        children: [
          { code: '7210', label: 'IT consultancy' },
        ],
      },
      {
        code: '722',
        label: 'Systems services',
        children: [
          { code: '7221', label: 'Systems analysis' },
          { code: '7222', label: 'Programming services' },
          { code: '7223', label: 'Systems integration' },
        ],
      },
      {
        code: '724',
        label: 'Network services',
        children: [
          { code: '7240', label: 'Internet services' },
        ],
      },
      {
        code: '726',
        label: 'Maintenance & support',
        children: [
          { code: '7261', label: 'Maintenance of software' },
          { code: '7262', label: 'Software support' },
        ],
      },
    ],
  },
  {
    code: '85',
    label: 'Healthcare',
    icon: '🏥',
    color: 'rose',
    children: [
      {
        code: '851',
        label: 'Human health services',
        children: [
          { code: '8511', label: 'Hospital services' },
          { code: '8512', label: 'Medical practice services' },
          { code: '8513', label: 'Dental services' },
        ],
      },
      {
        code: '853',
        label: 'Social work services',
        children: [
          { code: '8531', label: 'Social care services' },
          { code: '8532', label: 'Residential care' },
        ],
      },
    ],
  },
  {
    code: '79',
    label: 'Business Services',
    icon: '💼',
    color: 'teal',
    children: [
      {
        code: '791',
        label: 'Legal services',
        children: [
          { code: '7911', label: 'Legal advisory' },
        ],
      },
      {
        code: '792',
        label: 'Accounting services',
        children: [
          { code: '7921', label: 'Accounting & auditing' },
        ],
      },
      {
        code: '794',
        label: 'Recruitment services',
        children: [
          { code: '7941', label: 'Personnel recruitment' },
        ],
      },
      {
        code: '796',
        label: 'Security services',
        children: [
          { code: '7962', label: 'Guard services' },
        ],
      },
    ],
  },
  {
    code: '71',
    label: 'Engineering & Architecture',
    icon: '📐',
    color: 'slate',
    children: [
      {
        code: '711',
        label: 'Architecture services',
        children: [
          { code: '7111', label: 'Architectural design' },
        ],
      },
      {
        code: '712',
        label: 'Engineering services',
        children: [
          { code: '7121', label: 'Civil engineering' },
          { code: '7122', label: 'Structural engineering' },
        ],
      },
      {
        code: '713',
        label: 'Project management',
        children: [
          { code: '7131', label: 'Project supervision' },
        ],
      },
    ],
  },
  {
    code: '80',
    label: 'Education',
    icon: '📚',
    color: 'amber',
    children: [
      {
        code: '801',
        label: 'Primary education',
        children: [
          { code: '8010', label: 'Pre-primary and primary education' },
        ],
      },
      {
        code: '802',
        label: 'Secondary education',
        children: [
          { code: '8020', label: 'Secondary education services' },
        ],
      },
      {
        code: '803',
        label: 'Higher education',
        children: [
          { code: '8030', label: 'Higher education services' },
        ],
      },
      {
        code: '805',
        label: 'Training services',
        children: [
          { code: '8053', label: 'Driving instruction' },
        ],
      },
    ],
  },
  {
    code: '60',
    label: 'Transport',
    icon: '🚚',
    color: 'indigo',
    children: [
      {
        code: '601',
        label: 'Rail transport',
        children: [
          { code: '6010', label: 'Railway transport services' },
        ],
      },
      {
        code: '602',
        label: 'Road transport',
        children: [
          { code: '6021', label: 'Bus and coach services' },
          { code: '6022', label: 'Taxi services' },
        ],
      },
    ],
  },
  {
    code: '90',
    label: 'Environment & Waste',
    icon: '🌱',
    color: 'green',
    children: [
      {
        code: '901',
        label: 'Waste management',
        children: [
          { code: '9010', label: 'Waste collection' },
        ],
      },
      {
        code: '902',
        label: 'Cleaning services',
        children: [
          { code: '9021', label: 'Industrial cleaning' },
        ],
      },
      {
        code: '906',
        label: 'Environmental services',
        children: [
          { code: '9062', label: 'Environmental protection' },
        ],
      },
    ],
  },
  {
    code: '73',
    label: 'R&D Services',
    icon: '🔬',
    color: 'purple',
    children: [
      {
        code: '731',
        label: 'Research services',
        children: [
          { code: '7311', label: 'Natural sciences research' },
          { code: '7312', label: 'Social sciences research' },
        ],
      },
      {
        code: '732',
        label: 'Development services',
        children: [
          { code: '7320', label: 'Experimental development' },
        ],
      },
    ],
  },
];

/**
 * Flat list of all divisions for simple selection
 */
export const CPV_DIVISIONS_FLAT = CPV_HIERARCHY.map((div) => ({
  code: div.code,
  label: div.label,
  icon: div.icon,
  color: div.color,
}));

/**
 * Get division info by code
 */
export function getDivisionInfo(code: string): CpvDivision | undefined {
  return CPV_HIERARCHY.find((div) => div.code === code);
}

/**
 * Get parent division for any CPV code
 */
export function getParentDivision(cpvCode: string): string {
  return cpvCode.substring(0, 2);
}

/**
 * Get label for a CPV code at any level
 */
export function getCpvLabel(code: string): string {
  // Division level (2 digits)
  const division = CPV_HIERARCHY.find((d) => d.code === code);
  if (division) return division.label;

  // Group level (3 digits)
  for (const div of CPV_HIERARCHY) {
    const group = div.children.find((g) => g.code === code);
    if (group) return group.label;

    // Class level (4 digits)
    for (const grp of div.children) {
      const cls = grp.children?.find((c) => c.code === code);
      if (cls) return cls.label;
    }
  }

  return `CPV ${code}`;
}

/**
 * Search CPV hierarchy by label
 */
export function searchCpvCodes(query: string): CpvNode[] {
  const results: CpvNode[] = [];
  const lowerQuery = query.toLowerCase();

  for (const div of CPV_HIERARCHY) {
    if (div.label.toLowerCase().includes(lowerQuery)) {
      results.push({ code: div.code, label: div.label });
    }

    for (const group of div.children) {
      if (group.label.toLowerCase().includes(lowerQuery)) {
        results.push({ code: group.code, label: `${div.label} > ${group.label}` });
      }

      for (const cls of group.children || []) {
        if (cls.label.toLowerCase().includes(lowerQuery)) {
          results.push({
            code: cls.code,
            label: `${div.label} > ${group.label} > ${cls.label}`,
          });
        }
      }
    }
  }

  return results.slice(0, 20);
}
