interface SectionTitleProps {
  overline?: string;
  title: string;
}

export default function SectionTitle({ overline, title }: SectionTitleProps) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-16">
      {overline && (
        <p className="text-xs uppercase tracking-[0.2em] text-alpine-400 mb-4">
          {overline}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-mountain-800 leading-tight">
        {title}
      </h2>
    </div>
  );
}
