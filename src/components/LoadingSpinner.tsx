/**
 * Loading Spinner Component
 * Displays an animated spinner with optional label
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
};

export function LoadingSpinner({ size = 'md', label, fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated spinner */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer rotating ring */}
        <div
          className={`${sizeClasses[size]} absolute rounded-full border-4 border-transparent border-t-game border-r-game animate-spin`}
          style={{ animationDuration: '1.2s' }}
        />
        {/* Inner rotating ring (slower) */}
        <div
          className={`${sizeClasses[size]} absolute rounded-full border-4 border-transparent border-b-game/40 border-l-game/40 animate-spin`}
          style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
        />
      </div>

      {/* Label */}
      {label && (
        <div className="text-center">
          <p className="text-sm font-medium text-muted">{label}</p>
          <div className="mt-1 flex justify-center gap-1">
            <span className="h-1 w-1 rounded-full bg-game/40 animate-pulse" />
            <span
              className="h-1 w-1 rounded-full bg-game/40 animate-pulse"
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className="h-1 w-1 rounded-full bg-game/40 animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Minimal loading indicator
 */
export function LoadingDots() {
  return (
    <div className="flex gap-1">
      <span
        className="h-1.5 w-1.5 rounded-full bg-game animate-pulse"
        style={{ animationDelay: '0s' }}
      />
      <span
        className="h-1.5 w-1.5 rounded-full bg-game animate-pulse"
        style={{ animationDelay: '0.2s' }}
      />
      <span
        className="h-1.5 w-1.5 rounded-full bg-game animate-pulse"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
}

/**
 * Skeleton card loader for game cards
 */
export function GameCardSkeleton() {
  return (
    <div className="rounded-2xl border border-hairline bg-canvas p-6 animate-pulse">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-field" />
      <div className="h-6 w-32 rounded-lg bg-field" />
      <div className="mt-3 h-4 w-full rounded-lg bg-field" />
      <div className="mt-2 h-4 w-3/4 rounded-lg bg-field" />
      <div className="mt-4 h-4 w-20 rounded-lg bg-field" />
    </div>
  );
}
