import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isInOfflineMode, attemptReconnection } from "@/lib/supabase-client";

interface OfflineModeIndicatorProps {
  className?: string;
}

const OfflineModeIndicator: React.FC<OfflineModeIndicatorProps> = ({
  className,
}) => {
  const [isReconnecting, setIsReconnecting] = React.useState(false);
  const [showIndicator, setShowIndicator] = React.useState(false);

  // Check offline status on mount and periodically
  React.useEffect(() => {
    const checkOfflineStatus = () => {
      setShowIndicator(isInOfflineMode());
    };

    // Check immediately
    checkOfflineStatus();

    // Check every 5 seconds
    const interval = setInterval(checkOfflineStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      const result = await attemptReconnection();
      if (result.success) {
        setShowIndicator(false);
      }
    } catch (error) {
      console.error("Reconnection failed:", error);
    } finally {
      setIsReconnecting(false);
    }
  };

  if (!showIndicator) return null;

  return (
    <Alert
      className={`bg-yellow-50 border-yellow-200 text-yellow-800 ${className}`}
    >
      <WifiOff className="h-4 w-4" />
      <AlertTitle className="text-right">وضع عدم الاتصال</AlertTitle>
      <div className="flex justify-between items-center w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReconnect}
          disabled={isReconnecting}
          className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
        >
          {isReconnecting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              جاري المحاولة...
            </>
          ) : (
            "إعادة الاتصال"
          )}
        </Button>
        <AlertDescription className="text-right">
          أنت تعمل حاليًا في وضع عدم الاتصال. بعض الميزات قد لا تكون متاحة.
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default OfflineModeIndicator;
