import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';

describe('Login Component', () => {
  test('renders login form correctly', () => {
    render(<Login onLogin={() => {}} />);
    
    // Check if form elements exist
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
  });

  test('displays validation errors for empty fields', async () => {
    render(<Login onLogin={() => {}} />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
    });
  });

  test('calls onLogin when form is submitted with valid data', async () => {
    const handleLogin = jest.fn();
    render(<Login onLogin={handleLogin} />);
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'admin@injeerental.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'admin123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Wait for both the API call (1000ms) and the toast delay (1000ms)
    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalled();
    }, { timeout: 2500 });
  });

  test('displays loading state when submitting', async () => {
    render(<Login onLogin={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'admin@injeerental.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'admin123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });
});
