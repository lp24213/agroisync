import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';

describe('Layout', () => {
  it('renderiza o header, main e footer', () => {
    render(<Layout><div>Conteúdo</div></Layout>);
    expect(screen.getByText('AGROTM')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
}); 