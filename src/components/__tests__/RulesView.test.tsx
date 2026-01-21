import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RulesView from '../RulesView';
import type { Rule } from '../../utils/configLoader';

describe('RulesView', () => {
  const mockRules: Rule[] = [
    {
      title: 'Hooks System',
      content: 'Hook types: beforeShellExecution, afterShellExecution, afterFileEdit, stop',
    },
    {
      title: 'Testing Requirements',
      content: 'Minimum test coverage: 80%. All test types required.',
    },
    {
      title: 'Security Guidelines',
      content: 'No hardcoded secrets, input validation, SQL injection prevention',
    },
    {
      title: 'Coding Style',
      content: 'Immutability patterns, many small files, proper error handling',
    },
  ];

  it('should render rules list', () => {
    render(<RulesView rules={mockRules} />);

    expect(screen.getByText('Rules')).toBeInTheDocument();
    const countElements = screen.getAllByText((_, element) => {
      return (element?.textContent?.includes('총') && element?.textContent?.includes('규칙이 설정되어 있습니다')) ?? false;
    });
    expect(countElements.length).toBeGreaterThan(0);
  });

  it('should render all rule titles', () => {
    render(<RulesView rules={mockRules} />);

    mockRules.forEach((rule) => {
      expect(screen.getByText(rule.title)).toBeInTheDocument();
    });
  });

  it('should render all rule contents', () => {
    render(<RulesView rules={mockRules} />);

    mockRules.forEach((rule) => {
      expect(screen.getByText(rule.content)).toBeInTheDocument();
    });
  });

  it('should render empty rules list', () => {
    render(<RulesView rules={[]} />);

    expect(screen.getByText('Rules')).toBeInTheDocument();
    const countElements = screen.getAllByText((_, element) => {
      return (element?.textContent?.includes('총') && element?.textContent?.includes('규칙이 설정되어 있습니다')) ?? false;
    });
    expect(countElements.length).toBeGreaterThan(0);
  });

  it('should handle single rule', () => {
    const singleRule = [mockRules[0]];
    render(<RulesView rules={singleRule} />);

    expect(screen.getByText(singleRule[0].title)).toBeInTheDocument();
    expect(screen.getByText(singleRule[0].content)).toBeInTheDocument();
    expect(screen.getByText(/총.*규칙이 설정되어 있습니다/)).toBeInTheDocument();
  });

  it('should handle rules with empty content', () => {
    const ruleWithEmptyContent: Rule[] = [
      {
        title: 'Empty Rule',
        content: '',
      },
    ];

    render(<RulesView rules={ruleWithEmptyContent} />);

    expect(screen.getByText('Empty Rule')).toBeInTheDocument();
  });

  it('should handle rules with long content', () => {
    const ruleWithLongContent: Rule[] = [
      {
        title: 'Long Content Rule',
        content: 'This is a very long content that should be displayed properly without breaking the layout. It contains multiple sentences and should handle whitespace correctly.',
      },
    ];

    render(<RulesView rules={ruleWithLongContent} />);

    expect(screen.getByText('Long Content Rule')).toBeInTheDocument();
    expect(screen.getByText(ruleWithLongContent[0].content)).toBeInTheDocument();
  });

  it('should handle rules with multiline content', () => {
    const ruleWithMultiline: Rule[] = [
      {
        title: 'Multiline Rule',
        content: 'Line 1\nLine 2\nLine 3',
      },
    ];

    render(<RulesView rules={ruleWithMultiline} />);

    expect(screen.getByText('Multiline Rule')).toBeInTheDocument();
    // 멀티라인 콘텐츠는 정규식으로 검색
    expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    expect(screen.getByText(/Line 2/)).toBeInTheDocument();
    expect(screen.getByText(/Line 3/)).toBeInTheDocument();
  });

  it('should handle rules with special characters', () => {
    const ruleWithSpecialChars: Rule[] = [
      {
        title: 'Special Characters Rule',
        content: 'Contains: <script>, &amp;, @#$%, 한글',
      },
    ];

    render(<RulesView rules={ruleWithSpecialChars} />);

    expect(screen.getByText('Special Characters Rule')).toBeInTheDocument();
    expect(screen.getByText(ruleWithSpecialChars[0].content)).toBeInTheDocument();
  });

  it('should handle rules with numbers in title and content', () => {
    const ruleWithNumbers: Rule[] = [
      {
        title: 'Rule 123',
        content: 'Content with 456 and 789 numbers',
      },
    ];

    render(<RulesView rules={ruleWithNumbers} />);

    expect(screen.getByText('Rule 123')).toBeInTheDocument();
    expect(screen.getByText('Content with 456 and 789 numbers')).toBeInTheDocument();
  });
});
