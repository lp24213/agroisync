import { render, screen } from '@testing-library/react';
import HeroSection from '../components/hero/HeroSection';

describe('HeroSection', () => {
  it('renderiza título principal corretamente', () => {
    render(<HeroSection />);
    expect(screen.getByText('AGROTM')).toBeInTheDocument();
  });
});
