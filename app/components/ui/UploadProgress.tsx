type UploadProgressProps = {
  progress: number;
  label: string;
};

export function UploadProgress({ progress, label }: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-tm-muted">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-tm-pill bg-tm-surface-soft">
        <div
          className="h-full rounded-tm-pill bg-tm-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
