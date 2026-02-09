"""
UK Procurement Framework Templates

Contains:
- Framework-specific analysis templates
- Compliance checklists per framework type
- Social value guidance (Procurement Act 2023)
- Evaluation criteria patterns
"""

from typing import Any


def get_framework_template(framework_type: str | None) -> str | None:
    """
    Get analysis template for a specific framework type.

    Args:
        framework_type: Framework identifier (e.g., 'ccs_gcloud')

    Returns:
        Framework-specific analysis guidance
    """
    templates = {
        "ccs_gcloud": """
## G-Cloud Framework Analysis Template

### Key Evaluation Areas
1. **Service Definition** (Critical)
   - Clear service description matching Digital Marketplace categories
   - Lot eligibility: Cloud Hosting, Cloud Software, Cloud Support

2. **Pricing Model**
   - Rate card with consumption-based pricing
   - No hidden costs or complex pricing structures
   - Competitive against existing marketplace suppliers

3. **Security & Compliance**
   - Cyber Essentials (Mandatory)
   - Cyber Essentials Plus (Highly desirable)
   - ISO 27001 (Recommended)
   - Data residency (UK-based preferred)

4. **Service Levels**
   - Uptime guarantees (typically 99.9%+)
   - Support response times
   - Data backup and recovery

5. **Social Value** (Min 10%)
   - Skills and employment
   - Environmental sustainability
   - Supporting SMEs
""",
        "ccs_mcf": """
## Management Consultancy Framework (MCF4) Analysis Template

### Key Evaluation Areas
1. **Rate Cards** (Critical)
   - Advice rates (strategic/expert)
   - Delivery rates (implementation)
   - Day rates must be competitive

2. **Capability Evidence**
   - Relevant sector experience
   - Named consultants with CVs
   - Case studies (typically 3 required)

3. **Lot Alignment**
   - Lot 1: Business
   - Lot 2: Finance
   - Lot 3: People
   - Lot 4: Major Programmes
   - Lot 5: Corporate Finance
   - Lot 6: Health, Social Care & Community

4. **Social Value** (10% weighting)
   - Apprenticeships and training
   - Supply chain diversity
   - Carbon reduction commitments

5. **Quality Assessment**
   - Methodology and approach
   - Risk management
   - Knowledge transfer
""",
        "ccs_construction": """
## Construction Professional Services (CPS) Analysis Template

### Key Evaluation Areas
1. **Professional Capability**
   - RIBA/RICS/ICE membership
   - Relevant project experience
   - BIM Level 2 capability (often required)

2. **Project Delivery**
   - Team structure and CVs
   - Resource availability
   - Geographic coverage

3. **Health & Safety**
   - CDM compliance
   - H&S record and policies
   - CHAS/SafeContractor/Constructionline

4. **Sustainability**
   - BREEAM experience
   - Net zero project experience
   - Carbon reduction plans

5. **Social Value** (Min 10%)
   - Local employment
   - Apprenticeships
   - Community engagement
""",
        "open_tender": """
## Open Tender Analysis Template

### Selection Questionnaire (SQ) Requirements
1. **Part 1: Mandatory Exclusions**
   - Criminal convictions
   - Non-payment of taxes
   - Bankruptcy/insolvency

2. **Part 2: Selection Criteria**
   - Economic & Financial Standing (EFS)
   - Technical & Professional Ability
   - Insurance requirements

3. **Part 3: Evaluation Criteria**
   - Quality assessment (typically 60-70%)
   - Price evaluation (typically 30-40%)
   - Social Value (min 10% since Procurement Act 2023)

### Key Deadlines
- Clarification questions deadline
- Submission deadline (CRITICAL)
- Evaluation period
- Contract award date
""",
    }

    return templates.get(framework_type)


def get_compliance_checklist(framework_type: str | None) -> str | None:
    """
    Get compliance checklist for a specific framework type.

    Args:
        framework_type: Framework identifier

    Returns:
        Framework-specific compliance checklist
    """
    checklists = {
        "ccs_gcloud": """
## G-Cloud Compliance Checklist

### Mandatory Requirements
- [ ] Cyber Essentials certification (current)
- [ ] Company registration (UK or EU)
- [ ] Public liability insurance (typically £5m)
- [ ] Professional indemnity insurance (typically £2m)
- [ ] No mandatory exclusion grounds

### Service Requirements
- [ ] Service fits G-Cloud lot definition
- [ ] Published pricing on Digital Marketplace
- [ ] Terms align with Call-Off Contract
- [ ] Data protection compliance (UK GDPR)
- [ ] Service Level Agreements defined

### Security & Data
- [ ] Data residency disclosure
- [ ] Security incident procedures
- [ ] Business continuity plans
- [ ] Data backup and recovery procedures

### Social Value (Min 10%)
- [ ] Social Value response prepared
- [ ] Measurable commitments identified
- [ ] TOMs (Themes, Outcomes, Measures) aligned
""",
        "ccs_mcf": """
## MCF4 Compliance Checklist

### Mandatory Requirements
- [ ] Turnover threshold met for lot
- [ ] Professional indemnity insurance (varies by lot)
- [ ] No mandatory exclusion grounds
- [ ] Modern Slavery Statement (if applicable)

### Capability Evidence
- [ ] Rate cards (advice and delivery)
- [ ] Named consultant CVs
- [ ] 3 relevant case studies
- [ ] Client references available

### Quality Requirements
- [ ] Methodology documented
- [ ] Risk management approach
- [ ] Knowledge transfer plan
- [ ] Quality assurance processes

### Social Value (10% weighting)
- [ ] Social Value policy
- [ ] Measurable commitments
- [ ] Delivery tracking approach
""",
        "open_tender": """
## Open Tender Compliance Checklist

### SQ Part 1: Mandatory Exclusions
- [ ] No criminal convictions (specified offences)
- [ ] No non-payment of taxes
- [ ] Not bankrupt/insolvent
- [ ] No grave professional misconduct
- [ ] No conflicts of interest

### SQ Part 2: Selection Criteria
- [ ] Economic standing evidence
- [ ] Financial statements (typically 3 years)
- [ ] Insurance certificates
- [ ] Technical capability evidence
- [ ] Quality management systems
- [ ] Environmental management (if required)
- [ ] Health & Safety policies

### Procurement Act 2023 Requirements
- [ ] Carbon Reduction Plan (if >£5m)
- [ ] Modern Slavery Statement (if >£36m turnover)
- [ ] Social Value response (min 10% weighting)

### Submission Requirements
- [ ] All documents in required format
- [ ] Word/character limits observed
- [ ] All questions answered
- [ ] Declarations signed
- [ ] Submitted before deadline
""",
    }

    return checklists.get(framework_type, checklists["open_tender"])


def get_social_value_guidance() -> dict[str, Any]:
    """
    Get Social Value guidance based on Procurement Act 2023 and TOMs framework.

    Returns:
        Social Value themes and example measures
    """
    return {
        "overview": """
Social Value is now a mandatory consideration in UK public procurement under the
Procurement Act 2023. A minimum 10% evaluation weighting must be applied.
""",
        "themes": [
            {
                "theme": "Jobs & Skills",
                "description": "Creating employment and training opportunities",
                "measures": [
                    "Local employment (FTE jobs created)",
                    "Apprenticeships started",
                    "Work placements offered",
                    "Training hours provided",
                    "Graduates/NEETs hired",
                ],
                "evidenceRequired": [
                    "Employment targets and tracking",
                    "Apprenticeship levy usage",
                    "Training programme details",
                ],
            },
            {
                "theme": "Growth & Innovation",
                "description": "Supporting business growth and innovation",
                "measures": [
                    "SME spend percentage",
                    "Local supplier engagement",
                    "Innovation partnerships",
                    "VCSE engagement",
                ],
                "evidenceRequired": [
                    "Supply chain strategy",
                    "SME payment terms",
                    "Innovation examples",
                ],
            },
            {
                "theme": "Social & Community",
                "description": "Strengthening communities and reducing inequality",
                "measures": [
                    "Volunteering hours",
                    "Community investment",
                    "Charity partnerships",
                    "Diversity initiatives",
                ],
                "evidenceRequired": [
                    "Community engagement plan",
                    "Volunteering policy",
                    "EDI strategy",
                ],
            },
            {
                "theme": "Environment",
                "description": "Protecting and improving the environment",
                "measures": [
                    "Carbon reduction (tCO2e)",
                    "Waste reduction",
                    "Sustainable transport",
                    "Circular economy",
                    "Biodiversity net gain",
                ],
                "evidenceRequired": [
                    "Carbon Reduction Plan",
                    "Environmental management system",
                    "Net zero commitment",
                ],
            },
            {
                "theme": "Ethical Procurement",
                "description": "Responsible and ethical business practices",
                "measures": [
                    "Modern Slavery compliance",
                    "Living Wage commitment",
                    "Prompt payment",
                    "Tax transparency",
                ],
                "evidenceRequired": [
                    "Modern Slavery Statement",
                    "Living Wage accreditation",
                    "Payment policy",
                ],
            },
        ],
        "tips": [
            "Be SPECIFIC - avoid vague commitments",
            "Be MEASURABLE - include numbers and targets",
            "Be RELEVANT - align to buyer's priorities",
            "Be EVIDENCED - reference existing policies and track record",
            "Be PROPORTIONATE - match commitments to contract value",
        ],
        "carbonReductionPlan": {
            "threshold": "Contracts over £5 million",
            "requirements": [
                "Commitment to Net Zero by 2050",
                "Scope 1, 2, and (where possible) 3 emissions baseline",
                "Carbon reduction targets",
                "Actions to achieve reductions",
                "Published on company website",
            ],
            "template": "https://www.gov.uk/government/publications/procurement-policy-note-0621-taking-account-of-carbon-reduction-plans",
        },
    }


def get_evaluation_criteria_guidance(framework_type: str | None) -> dict[str, Any]:
    """
    Get typical evaluation criteria weightings for framework type.

    Args:
        framework_type: Framework identifier

    Returns:
        Evaluation criteria guidance
    """
    criteria = {
        "ccs_gcloud": {
            "typical_weightings": {
                "quality": {"min": 70, "max": 90, "typical": 80},
                "price": {"min": 10, "max": 30, "typical": 20},
                "social_value": {"min": 10, "max": 15, "typical": 10},
            },
            "quality_subcriteria": [
                "Service capability and features",
                "Security and compliance",
                "Support and service levels",
                "Implementation approach",
            ],
        },
        "ccs_mcf": {
            "typical_weightings": {
                "quality": {"min": 70, "max": 85, "typical": 80},
                "price": {"min": 5, "max": 20, "typical": 10},
                "social_value": {"min": 10, "max": 15, "typical": 10},
            },
            "quality_subcriteria": [
                "Understanding and approach",
                "Relevant experience",
                "Team capability",
                "Risk management",
                "Knowledge transfer",
            ],
        },
        "open_tender": {
            "typical_weightings": {
                "quality": {"min": 50, "max": 80, "typical": 60},
                "price": {"min": 20, "max": 50, "typical": 30},
                "social_value": {"min": 10, "max": 20, "typical": 10},
            },
            "quality_subcriteria": [
                "Technical approach",
                "Methodology",
                "Team and resources",
                "Risk management",
                "Added value",
            ],
        },
    }

    return criteria.get(framework_type, criteria["open_tender"])
