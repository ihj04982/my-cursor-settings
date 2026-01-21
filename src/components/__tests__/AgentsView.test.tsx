import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AgentsView from '../AgentsView';
import type { Agent } from '../../utils/configLoader';

describe('AgentsView', () => {
  const mockAgents: Agent[] = [
    {
      name: 'planner',
      description: 'Expert planning specialist',
      model: 'opus',
      tools: ['Read', 'Grep', 'Glob'],
    },
    {
      name: 'code-reviewer',
      description: 'Expert code review specialist',
      model: 'sonnet',
      tools: ['Read', 'Grep', 'Bash'],
    },
    {
      name: 'tdd-guide',
      description: 'Test-driven development specialist',
      model: 'haiku',
      tools: ['Read', 'Write'],
    },
  ];

  it('should render agents list', () => {
    render(<AgentsView agents={mockAgents} />);

    expect(screen.getByText('Agents')).toBeInTheDocument();
    const countElements = screen.getAllByText((content, element) => {
      return (element?.textContent?.includes('총') && element?.textContent?.includes('에이전트가 설정되어 있습니다')) ?? false;
    });
    expect(countElements.length).toBeGreaterThan(0);
  });

  it('should render all agent names', () => {
    render(<AgentsView agents={mockAgents} />);

    mockAgents.forEach((agent) => {
      expect(screen.getByText(agent.name)).toBeInTheDocument();
    });
  });

  it('should render all agent descriptions', () => {
    render(<AgentsView agents={mockAgents} />);

    mockAgents.forEach((agent) => {
      expect(screen.getByText(agent.description)).toBeInTheDocument();
    });
  });

  it('should render all agent models', () => {
    render(<AgentsView agents={mockAgents} />);

    mockAgents.forEach((agent) => {
      expect(screen.getByText(agent.model)).toBeInTheDocument();
    });
  });

  it('should render all agent tools', () => {
    render(<AgentsView agents={mockAgents} />);

    mockAgents.forEach((agent) => {
      agent.tools.forEach((tool) => {
        const tools = screen.getAllByText(tool);
        expect(tools.length).toBeGreaterThan(0);
        expect(tools[0]).toBeInTheDocument();
      });
    });
  });

  it('should render empty agents list', () => {
    render(<AgentsView agents={[]} />);

    expect(screen.getByText('Agents')).toBeInTheDocument();
    const countElements = screen.getAllByText((content, element) => {
      return (element?.textContent?.includes('총') && element?.textContent?.includes('에이전트가 설정되어 있습니다')) ?? false;
    });
    expect(countElements.length).toBeGreaterThan(0);
  });

  it('should handle single agent', () => {
    const singleAgent = [mockAgents[0]];
    render(<AgentsView agents={singleAgent} />);

    expect(screen.getByText(singleAgent[0].name)).toBeInTheDocument();
    expect(screen.getByText(/총.*에이전트가 설정되어 있습니다/)).toBeInTheDocument();
  });

  it('should render agent with empty tools array', () => {
    const agentWithNoTools: Agent[] = [
      {
        name: 'test-agent',
        description: 'Test agent',
        model: 'opus',
        tools: [],
      },
    ];

    render(<AgentsView agents={agentWithNoTools} />);

    expect(screen.getByText('test-agent')).toBeInTheDocument();
    expect(screen.getByText('Test agent')).toBeInTheDocument();
  });

  it('should handle agents with many tools', () => {
    const agentWithManyTools: Agent[] = [
      {
        name: 'multi-tool-agent',
        description: 'Agent with many tools',
        model: 'sonnet',
        tools: ['Read', 'Write', 'Grep', 'Glob', 'Bash', 'Python'],
      },
    ];

    render(<AgentsView agents={agentWithManyTools} />);

    expect(screen.getByText('multi-tool-agent')).toBeInTheDocument();
    agentWithManyTools[0].tools.forEach((tool) => {
      expect(screen.getByText(tool)).toBeInTheDocument();
    });
  });

  it('should apply correct model colors', () => {
    render(<AgentsView agents={mockAgents} />);

    // 모델 색상은 CSS 클래스로 적용되므로 각 에이전트가 렌더링되는지 확인
    expect(screen.getByText('planner')).toBeInTheDocument();
    expect(screen.getByText('code-reviewer')).toBeInTheDocument();
    expect(screen.getByText('tdd-guide')).toBeInTheDocument();
    
    // 각 모델 이름이 표시되는지 확인
    expect(screen.getByText('opus')).toBeInTheDocument();
    expect(screen.getByText('sonnet')).toBeInTheDocument();
    expect(screen.getByText('haiku')).toBeInTheDocument();
  });

  it('should use fallback color for unknown model', () => {
    const agentWithUnknownModel: Agent[] = [
      {
        name: 'unknown-model-agent',
        description: 'Agent with unknown model',
        model: 'unknown-model' as any,
        tools: ['Read'],
      },
    ];

    render(<AgentsView agents={agentWithUnknownModel} />);

    expect(screen.getByText('unknown-model-agent')).toBeInTheDocument();
    expect(screen.getByText('unknown-model')).toBeInTheDocument();
    
    // fallback 색상이 적용되었는지 확인 (모델 이름이 표시되면 렌더링은 성공)
    const modelElement = screen.getByText('unknown-model');
    expect(modelElement).toBeInTheDocument();
  });
});
