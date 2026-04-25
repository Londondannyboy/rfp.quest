'use client';

import { InteractiveBackground } from '@/components/ui/interactive-background';
import { RotatingWords, StaggeredRotatingWords } from '@/components/ui/rotating-words';
import { 
  StaggeredContainer, 
  StaggeredItem, 
  SlideReveal, 
  FloatingElement, 
  MagneticElement,
  TextReveal 
} from '@/components/ui/sophisticated-animations';
import { ProfessionalButton } from '@/components/ui/professional-buttons';
import { NavigationCard, InteractiveCard } from '@/components/ui/interactive-cards';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface HomepageClientProps {
  page: Record<string, any>;
}

export function HomepageClient({ page }: HomepageClientProps) {
  return (
    <>
      {/* Advanced Interactive Hero Section with THREE.js Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* THREE.js Interactive Background */}
        <InteractiveBackground className="pointer-events-auto" />
        
        {/* Additional decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating orbital elements */}
          <FloatingElement className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl" intensity={15} duration={8}>
            <div />
          </FloatingElement>
          <FloatingElement className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-slate-400/15 rounded-full blur-2xl" intensity={12} duration={10}>
            <div />
          </FloatingElement>
          <FloatingElement className="absolute top-2/3 left-2/3 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" intensity={8} duration={6}>
            <div />
          </FloatingElement>
          
          {/* Particle constellation */}
          <FloatingElement className="absolute top-1/5 right-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-70" intensity={5} duration={4}>
            <div />
          </FloatingElement>
          <FloatingElement className="absolute bottom-1/5 left-1/5 w-1.5 h-1.5 bg-slate-600/80 rounded-full opacity-60" intensity={6} duration={5}>
            <div />
          </FloatingElement>
          <FloatingElement className="absolute top-3/4 right-1/5 w-1 h-1 bg-blue-300 rounded-full opacity-80" intensity={4} duration={3}>
            <div />
          </FloatingElement>
          <FloatingElement className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50" intensity={7} duration={7}>
            <div />
          </FloatingElement>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium announcement badge with enhanced styling */}
            <div className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold bg-slate-900/60 text-blue-300 ring-1 ring-blue-500/30 backdrop-blur-xl shadow-lg shadow-blue-900/20 mb-10 transition-all duration-300 hover:scale-105 hover:bg-slate-800/60">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
              <span>Coming Soon - Q2 2026</span>
              <svg className="ml-3 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.093 10.5a.75.75 0 00-1.186.918l1.875 2.416a.75.75 0 001.183.02l3.633-5.05.12-.045z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Advanced title with rotating words and gradient effects */}
            <StaggeredContainer className="mb-10">
              <StaggeredItem>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                  <TextReveal className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    RFP Platform Quest — AI-Powered 
                  </TextReveal>
                  <div className="mt-2">
                    <StaggeredRotatingWords 
                      words={['RFP Software', 'Bid Writing', 'Tender Discovery', 'Proposal Management', 'UK Procurement']}
                      className="text-5xl sm:text-6xl lg:text-7xl"
                      interval={3500}
                    />
                  </div>
                  <TextReveal className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent" delay={0.3}>
                    for UK Procurement
                  </TextReveal>
                </h1>
              </StaggeredItem>
            </StaggeredContainer>
            
            {/* Enhanced subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto mb-14 leading-relaxed font-light">
              {page.meta_description}
            </p>
            
            {/* Advanced CTA buttons with professional styling */}
            <StaggeredContainer className="mb-16">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <StaggeredItem>
                  <ProfessionalButton
                    variant="gradient"
                    size="xl"
                    href="https://calendly.com/my-first-quest"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>}
                  >
                    Register Early
                  </ProfessionalButton>
                </StaggeredItem>
                <StaggeredItem>
                  <ProfessionalButton
                    variant="ghost"
                    size="xl"
                    href="#features"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>}
                  >
                    Learn More
                  </ProfessionalButton>
                </StaggeredItem>
              </div>
            </StaggeredContainer>

            {/* Trust indicators with enhanced styling */}
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 text-slate-300">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                UK Government Compliant
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Enterprise Security
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                AI-Powered Analysis
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Navigation Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <SlideReveal className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
              Explore Our Platform
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover how RFP Platform Quest transforms your tender response process with AI-powered features
            </p>
          </SlideReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <NavigationCard
              title="AI Bid Writing"
              description="Generate compelling proposal content with advanced AI algorithms tailored to UK procurement requirements"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>}
              href="#ai-writing"
            />
            <NavigationCard
              title="Tender Discovery"
              description="Automatically find relevant government contracts using intelligent matching algorithms and real-time alerts"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>}
              href="#discovery"
            />
            <NavigationCard
              title="Proposal Management"
              description="Collaborate seamlessly with team members, track progress, and manage multiple bids from one unified dashboard"
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>}
              href="#management"
            />
          </div>
        </div>
      </section>
    </>
  );
}