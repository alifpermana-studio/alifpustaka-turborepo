import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Username from '../src/app/(admin)/profile/[username]/page';

describe('Page', () => {
  it('renders a heading', () => {
    render(<Username />);

    const heading = screen.getByRole('heading', { level: 3 });

    expect(heading).toBeInTheDocument();
  });
});
