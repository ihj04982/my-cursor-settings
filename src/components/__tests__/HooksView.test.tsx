import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HooksView from '../HooksView';
import type { Hook } from '../../utils/configLoader';

describe('HooksView', () => {
  const mockHooks: Hook[] = [
    {
      type: 'beforeShellExecution',
      command: 'bash .cursor/hooks/before_cmd.sh',
      script: 'Git push safety check',
    },
    {
      type: 'afterShellExecution',
      command: 'bash .cursor/hooks/after_cmd.sh',
      script: 'PR creation logger',
    },
    {
      type: 'afterFileEdit',
      command: 'bash .cursor/hooks/after_edit.sh',
      script: 'Prettier auto-format',
    },
    {
      type: 'stop',
      command: 'bash .cursor/hooks/on_stop.sh',
      script: 'console.log audit',
    },
  ];

  it('should render hooks list', () => {
    render(<HooksView hooks={mockHooks} />);

    expect(screen.getByText('Hooks')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.textContent?.includes('총') && element?.textContent?.includes('개의 훅이 설정되어 있습니다')) ?? false;
    })).toBeInTheDocument();
  });

  it('should render all hook types', () => {
    render(<HooksView hooks={mockHooks} />);

    expect(screen.getByText('명령 실행 전')).toBeInTheDocument();
    expect(screen.getByText('명령 실행 후')).toBeInTheDocument();
    expect(screen.getByText('파일 수정 후')).toBeInTheDocument();
    expect(screen.getByText('세션 종료 시')).toBeInTheDocument();
  });

  it('should render all hook commands', () => {
    render(<HooksView hooks={mockHooks} />);

    mockHooks.forEach((hook) => {
      expect(screen.getByText(hook.command)).toBeInTheDocument();
    });
  });

  it('should render all hook scripts when provided', () => {
    render(<HooksView hooks={mockHooks} />);

    mockHooks.forEach((hook) => {
      if (hook.script) {
        expect(screen.getByText(hook.script)).toBeInTheDocument();
      }
    });
  });

  it('should render empty hooks list', () => {
    render(<HooksView hooks={[]} />);

    expect(screen.getByText('Hooks')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.textContent?.includes('총') && element?.textContent?.includes('개의 훅이 설정되어 있습니다')) ?? false;
    })).toBeInTheDocument();
  });

  it('should handle hooks without script', () => {
    const hooksWithoutScript: Hook[] = [
      {
        type: 'beforeShellExecution',
        command: 'bash .cursor/hooks/before_cmd.sh',
      },
    ];

    render(<HooksView hooks={hooksWithoutScript} />);

    expect(screen.getByText('명령 실행 전')).toBeInTheDocument();
    expect(screen.getByText('bash .cursor/hooks/before_cmd.sh')).toBeInTheDocument();
  });

  it('should handle single hook', () => {
    const singleHook = [mockHooks[0]];
    render(<HooksView hooks={singleHook} />);

    expect(screen.getByText('명령 실행 전')).toBeInTheDocument();
    expect(screen.getByText(/총.*개의 훅이 설정되어 있습니다/)).toBeInTheDocument();
  });

  it('should handle all hook types with proper labels', () => {
    const allHookTypes: Hook[] = [
      {
        type: 'beforeShellExecution',
        command: 'bash .cursor/hooks/before.sh',
      },
      {
        type: 'afterShellExecution',
        command: 'bash .cursor/hooks/after.sh',
      },
      {
        type: 'afterFileEdit',
        command: 'bash .cursor/hooks/edit.sh',
      },
      {
        type: 'stop',
        command: 'bash .cursor/hooks/stop.sh',
      },
    ];

    render(<HooksView hooks={allHookTypes} />);

    expect(screen.getByText('명령 실행 전')).toBeInTheDocument();
    expect(screen.getByText('명령 실행 후')).toBeInTheDocument();
    expect(screen.getByText('파일 수정 후')).toBeInTheDocument();
    expect(screen.getByText('세션 종료 시')).toBeInTheDocument();
  });

  it('should display hook type in korean labels', () => {
    render(<HooksView hooks={mockHooks} />);

    const hookTypeLabels = {
      beforeShellExecution: '명령 실행 전',
      afterShellExecution: '명령 실행 후',
      afterFileEdit: '파일 수정 후',
      stop: '세션 종료 시',
    };

    mockHooks.forEach((hook) => {
      const label = hookTypeLabels[hook.type as keyof typeof hookTypeLabels];
      if (label) {
        expect(screen.getByText(label)).toBeInTheDocument();
      }
    });
  });
});
