import React from 'react';
import { render, screen } from '@testing-library/react';
import IntroVideo from './IntroVideo';

describe('IntroVideo', () => {
  it('renderiza o vídeo corretamente', () => {
    render(<IntroVideo />);
    expect(screen.getByRole('video')).toBeInTheDocument();
  });
}); 