// Testing utilities for all Binna platform products
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import userEvent from '@testing-library/user-event';

// Mock NextAuth for testing
export const mockNextAuth = {
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: '1',
        email: 'test@binna.sa',
        name: 'Test User',
        role: 'admin',
      },
    },
    status: 'authenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
};

// Mock Next.js router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
};

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
};

// Test utilities for components
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  // Wrapper component that provides all necessary contexts
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div data-testid="test-wrapper">
        {children}
      </div>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Common test scenarios
export const testScenarios = {
  // Test authentication scenarios
  auth: {
    authenticated: {
      data: {
        user: {
          id: '1',
          email: 'admin@binna.sa',
          name: 'Admin User',
          role: 'admin',
        },
      },
      status: 'authenticated',
    },
    unauthenticated: {
      data: null,
      status: 'unauthenticated',
    },
    loading: {
      data: null,
      status: 'loading',
    },
  },

    // Real test users matching production data
  users: {
    admin: {
      id: 'admin-001',
      email: 'admin@binaa.com',
      name: 'مدير النظام',
      role: 'admin',
    },
    storeOwner: {
      id: 'real-store-001',
      email: 'store@binaa.com',
      name: 'أحمد التجاري',
      role: 'store_owner',
    },
    user: {
      id: 'real-user-001',
      email: 'user@binaa.com',
      name: 'محمد العبدالله',
      role: 'user',
    },
    customer: {
      id: 'real-user-001',
      email: 'user@binaa.com',
      name: 'محمد العبدالله',
      role: 'customer',
    },
  },

  // Test API responses
  api: {
    success: (data: any) => mockApiResponse(data, 200),
    error: (message: string) => mockApiResponse({ error: message }, 400),
    unauthorized: () => mockApiResponse({ error: 'Unauthorized' }, 401),
    notFound: () => mockApiResponse({ error: 'Not found' }, 404),
    serverError: () => mockApiResponse({ error: 'Internal server error' }, 500),
  },
};

// Assertion helpers
export const expectToBeVisible = (element: string | HTMLElement) => {
  const el = typeof element === 'string' ? screen.getByTestId(element) : element;
  expect(el).toBeInTheDocument();
  expect(el).toBeVisible();
};

export const expectToBeHidden = (element: string | HTMLElement) => {
  const el = typeof element === 'string' ? screen.queryByTestId(element) : element;
  expect(el).not.toBeInTheDocument();
};

export const expectButtonToBeEnabled = (buttonText: string) => {
  const button = screen.getByRole('button', { name: buttonText });
  expect(button).toBeEnabled();
};

export const expectButtonToBeDisabled = (buttonText: string) => {
  const button = screen.getByRole('button', { name: buttonText });
  expect(button).toBeDisabled();
};

// Interaction helpers
export const clickButton = async (buttonText: string) => {
  const user = userEvent.setup();
  const button = screen.getByRole('button', { name: buttonText });
  await user.click(button);
};

export const fillInput = async (labelText: string, value: string) => {
  const user = userEvent.setup();
  const input = screen.getByLabelText(labelText);
  await user.clear(input);
  await user.type(input, value);
};

export const selectOption = async (labelText: string, optionText: string) => {
  const user = userEvent.setup();
  const select = screen.getByLabelText(labelText);
  await user.selectOptions(select, optionText);
};

// Wait for async operations
export const waitForLoading = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });
};

export const waitForError = async () => {
  await waitFor(() => {
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });
};

// Common test patterns
export const testComponentRender = (Component: React.ComponentType, props = {}) => {
  it('renders without crashing', () => {
    renderWithProviders(<Component {...props} />);
  });
};

export const testAccessibility = (Component: React.ComponentType, props = {}) => {
  it('meets accessibility standards', async () => {
    const { container } = renderWithProviders(<Component {...props} />);
    // Add accessibility testing logic here
    expect(container).toBeInTheDocument();
  });
};

export const testResponsiveness = (Component: React.ComponentType, props = {}) => {
  it('is responsive on different screen sizes', () => {
    renderWithProviders(<Component {...props} />);
    // Add responsive testing logic here
  });
};

export {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
};


