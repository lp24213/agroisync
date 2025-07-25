import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../../frontend/pages/index';

describe('Home Landing', () => {
  it('renderiza título principal corretamente', () => {
    const { getByText } = render(<Home />);
    expect(getByText(/AGROTM/i)).toBeInTheDocument();
  });
});
