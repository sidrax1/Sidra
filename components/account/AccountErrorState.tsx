import {
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

interface AccountErrorStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly retrying?: boolean;
  readonly onRetry?: () => void | Promise<void>;
}

export function AccountErrorState({
  description = "Your account information could not be loaded securely. Please try again.",
  onRetry,
  retrying = false,
  title = "Account unavailable",
}: AccountErrorStateProps): React.JSX.Element {
  return (
    <ErrorState
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button
            variant="outline"
            loading={retrying}
            loadingLabel="Retrying"
            onClick={() => {
              void onRetry();
            }}
          >
            <RefreshCw
              aria-hidden={true}
              className="size-4"
            />
            Try Again
          </Button>
        ) : undefined
      }
    />
  );
}
