import React from 'react';
import { render, screen } from '@testing-library/react';
import PdfViewer from './PdfViewer';

describe('PdfViewer', () => {
  it('renderiza o iframe corretamente', () => {
    render(<PdfViewer file="/whitepaper.pdf" />);
    expect(screen.getByTitle('PDF Viewer')).toBeInTheDocument();
  });
});
