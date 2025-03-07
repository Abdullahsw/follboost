import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-4 border rounded-md bg-red-50">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              <p className="mb-2">An error occurred in this component.</p>
              {this.state.error && (
                <pre className="text-xs bg-red-100 p-2 rounded overflow-auto max-h-[200px]">
                  {this.state.error.toString()}
                </pre>
              )}
              <div className="mt-4">
                <Button
                  onClick={this.handleReset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
