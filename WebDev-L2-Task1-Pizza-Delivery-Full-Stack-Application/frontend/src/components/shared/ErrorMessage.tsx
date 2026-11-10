interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

export function ErrorMessage({
  message = "Something went wrong.",
  retry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center text-destructive">
      <p className="text-sm font-medium">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="text-sm underline underline-offset-4 hover:text-destructive/80"
        >
          Try again
        </button>
      )}
    </div>
  );
}
