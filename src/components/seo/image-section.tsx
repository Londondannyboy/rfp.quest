import Image from 'next/image';
import Link from 'next/link';

interface ImageSectionProps {
  image: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  overlay?: 'light' | 'dark' | 'gradient';
  position?: 'left' | 'right' | 'center';
  height?: 'sm' | 'md' | 'lg';
}

export function ImageSection({
  image,
  imageAlt,
  title,
  subtitle,
  ctaText,
  ctaLink,
  overlay = 'gradient',
  position = 'center',
  height = 'md',
}: ImageSectionProps) {
  const heightClasses = {
    sm: 'min-h-[300px] md:min-h-[400px]',
    md: 'min-h-[400px] md:min-h-[500px]',
    lg: 'min-h-[500px] md:min-h-[600px]',
  };

  const overlayClasses = {
    light: 'bg-white/80 dark:bg-slate-900/80',
    dark: 'bg-black/60',
    gradient: 'bg-gradient-to-r from-teal-900/90 via-teal-800/70 to-transparent',
  };

  const positionClasses = {
    left: 'items-start text-left',
    right: 'items-end text-right',
    center: 'items-center text-center',
  };

  return (
    <section className={`relative ${heightClasses[height]} flex items-center overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />

      {/* Content */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 py-16 w-full flex flex-col ${positionClasses[position]}`}>
        <div className={`${position === 'center' ? 'max-w-3xl' : 'max-w-2xl'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}
          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="inline-block px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors shadow-lg hover:shadow-xl"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
