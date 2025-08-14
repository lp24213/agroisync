export const captureException = (error: Error, context?: Record<string, any>): void => {
  // Mock Sentry exception capture
  console.error('Sentry Exception:', error, context);
};

export const addBreadcrumb = (breadcrumb: {
  message: string;
  category: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}): void => {
  // Mock Sentry breadcrumb
  console.log('Sentry Breadcrumb:', breadcrumb);
};

export const setUser = (user: {
  id: string;
  email?: string;
  username?: string;
}): void => {
  // Mock Sentry user set
  console.log('Sentry User Set:', user);
};

export const setTag = (key: string, value: string): void => {
  // Mock Sentry tag set
  console.log('Sentry Tag Set:', key, value);
};
