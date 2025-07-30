declare module 'react-hot-toast' {
  export interface ToastOptions {
    id?: string;
    icon?: React.ReactNode;
    duration?: number;
    ariaProps?: {
      role: 'status' | 'alert';
      'aria-live': 'assertive' | 'off' | 'polite';
    };
    className?: string;
    style?: React.CSSProperties;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    iconTheme?: {
      primary: string;
      secondary: string;
    };
  }

  export interface Toast {
    type: 'success' | 'error' | 'loading' | 'blank' | 'custom';
    id: string;
    message: string;
    icon?: React.ReactNode;
    duration?: number;
    pauseDuration: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    ariaProps: {
      role: 'status' | 'alert';
      'aria-live': 'assertive' | 'off' | 'polite';
    };
    style?: React.CSSProperties;
    className?: string;
    iconTheme?: {
      primary: string;
      secondary: string;
    };
    createdAt: number;
    visible: boolean;
    height?: number;
  }

  export interface ToasterProps {
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    toastOptions?: ToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerClassName?: string;
    containerStyle?: React.CSSProperties;
  }

  export const toast: {
    (message: string, options?: ToastOptions): string;
    success: (message: string, options?: ToastOptions) => string;
    error: (message: string, options?: ToastOptions) => string;
    loading: (message: string, options?: ToastOptions) => string;
    custom: (jsx: React.ReactNode, options?: ToastOptions) => string;
    dismiss: (toastId?: string) => void;
    remove: (toastId?: string) => void;
    promise: <T>(
      promise: Promise<T>,
      msgs: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: any) => string);
      },
      options?: ToastOptions
    ) => Promise<T>;
  };

  export const Toaster: React.FC<ToasterProps>;
  export const resolveValue: (valOrFunction: any, arg: any) => any;
  export const useToaster: (toastOptions?: ToastOptions) => {
    toasts: Toast[];
    handlers: {
      updateHeight: (toastId: string, height: number) => void;
      startPause: () => void;
      endPause: () => void;
      calculateOffset: (toast: Toast, opts?: { reverseOrder?: boolean; gutter?: number; defaultPosition?: string }) => number;
    };
  };
  export const useToasterStore: (toastOptions?: ToastOptions) => {
    toasts: Toast[];
    pausedAt: number | undefined;
  };
}