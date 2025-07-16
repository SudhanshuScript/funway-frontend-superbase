
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SessionsOverview from "@/components/sessions-new/SessionsOverview";
import { SessionsProvider } from "@/components/sessions-new/context/SessionsContext";
import { Toaster } from "sonner";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Error fallback component to display when an error occurs
const ErrorFallback = ({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-xl font-semibold mb-2">Something went wrong</AlertTitle>
      <AlertDescription>
        <p className="mb-4">{error.message}</p>
        <Button
          onClick={resetErrorBoundary}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

const SessionsNew = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset application state here if needed
          console.log("Error boundary reset");
          window.location.reload();
        }}
      >
        <SessionsProvider>
          <Toaster position="top-right" richColors />
          <SessionsOverview />
        </SessionsProvider>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default SessionsNew;
