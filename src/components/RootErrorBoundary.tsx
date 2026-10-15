import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by RootErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0b0b] text-[#f4f3ef] flex items-center justify-center p-4 font-mono select-none">
          <div className="w-full max-w-lg bg-[#121316] border border-red-500/30 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Red accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight font-heading uppercase text-white">
                  JRRVS // SYSTEM RECOVERY
                </h1>
                <p className="text-xs text-[#a1a1aa]">Application encountered an unexpected state</p>
              </div>
            </div>

            <div className="bg-[#18191c] border border-[#27272a] rounded-lg p-3 my-4 text-xs">
              <p className="text-red-400 font-semibold mb-1">Error Message:</p>
              <pre className="text-[11px] text-[#f4f3ef]/80 overflow-x-auto whitespace-pre-wrap font-mono">
                {this.state.error?.message || 'Unknown runtime error occurred.'}
              </pre>
            </div>

            <p className="text-xs text-[#71717a] leading-relaxed mb-6">
              Don&apos;t worry &mdash; your saved items and preferences are safe. Click below to reload or reset the local cache.
            </p>

            <div className="space-y-2">
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleClearCacheAndReload}
                className="w-full py-2.5 px-4 bg-[#1f2024] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 border border-[#2e3036] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local Cache & Restart</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1f2024] flex items-center justify-between text-[10px] text-[#52525b]">
              <span>JRRVS STREETWEAR HQ</span>
              <span>AUTO RECOVERY SHIELD</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
