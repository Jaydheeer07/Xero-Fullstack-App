import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTenant } from '@/components/hooks/use-tenant';

export function ErrorDialog() {
  const { error, fetchTenants, resetTenantError } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Show dialog when error occurs
  useEffect(() => {
    if (error) {
      setIsOpen(true);
    }
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await fetchTenants();
      setIsOpen(false);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    resetTenantError();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Error
          </DialogTitle>
          <DialogDescription>
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleDismiss}
              >
                Dismiss
              </Button>
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-2"
              >
                {isRetrying && <RefreshCw className="h-4 w-4 animate-spin" />}
                Retry
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}