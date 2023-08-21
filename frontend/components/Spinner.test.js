// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import Spinner from './Spinner';


test('renders spinner when "on" prop is true', () => {
  const { getByTestId } = render(<Spinner on={true} />);

  const spinner = getByTestId('spinner');
  expect(spinner).toBeInTheDocument();

 
});

test('does not render spinner when "on" prop is false', () => {
  const { queryByTestId } = render(<Spinner on={false} />);

  const spinner = queryByTestId('spinner');
  expect(spinner).not.toBeInTheDocument();
});
