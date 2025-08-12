import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompletedComponent from './CompletedComponent';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('CompletedComponent modal behavior', () => {
  it('opens modal for incomplete mutual review project', () => {
    render(<CompletedComponent />);
    // click the first project title (incomplete)
    fireEvent.click(screen.getByText('연합동아리 부스전 기획 프로젝트').closest('.completed-item'));
    expect(screen.getByText('상호평가 완료 후 열람 가능해요')).toBeInTheDocument();
    expect(screen.getByText('나중에 하기')).toBeInTheDocument();
    expect(screen.getByText('작성하기')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { __mockNavigate as mockNavigate } from '../../../test-utils/react-router-dom-mock';
import CompletedComponent from './CompletedComponent';

// useNavigate is mapped via moduleNameMapper; spy imported above

describe('CompletedComponent navigation', () => {
  it('navigates to /project/:id/rating-project when a completed item is clicked', () => {
    render(<CompletedComponent />);

    const itemTitle = screen.getByText('연합동아리 부스전 기획 프로젝트');
    fireEvent.click(itemTitle.closest('.completed-item'));

    expect(mockNavigate).toHaveBeenCalledWith('/project/2/rating-project', expect.any(Object));
  });
});


