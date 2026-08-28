type LoadingSkeletonProps = {
  admin?: boolean;
  cards?: number;
};

export function LoadingSkeleton({ admin = false, cards = 3 }: LoadingSkeletonProps) {
  return (
    <div className={`route-loading ${admin ? "route-loading-admin" : ""}`} role="status" aria-live="polite" aria-label="Carregando conteúdo">
      <span className="sr-only">Carregando conteúdo...</span>
      <div className="loading-heading skeleton-block" />
      <div className="loading-subheading skeleton-block" />
      <div className="loading-card-grid">
        {Array.from({ length: cards }, (_, index) => (
          <div className="loading-card" key={index} aria-hidden="true">
            <div className="loading-image skeleton-block" />
            <div className="loading-line skeleton-block" />
            <div className="loading-line loading-line-short skeleton-block" />
          </div>
        ))}
      </div>
    </div>
  );
}
