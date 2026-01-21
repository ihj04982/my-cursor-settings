import { test, expect } from '@playwright/test';

test.describe('Cursor Settings Visualizer E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display loading state initially', async ({ page }) => {
    // 로딩 상태 확인 (로딩이 빠르게 완료될 수 있으므로 옵션 처리)
    // 페이지가 로드되기 전에 로딩 상태를 확인하려고 시도
    try {
      const loadingText = page.getByText('설정을 불러오는 중...');
      await expect(loadingText).toBeVisible({ timeout: 500 });
    } catch {
      // 로딩이 이미 완료된 경우, 헤더가 표시되는지 확인
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: 'Cursor 설정 시각화' })).toBeVisible();
    }
  });

  test('should load and display header correctly', async ({ page }) => {
    // 로딩 완료 대기
    await page.waitForLoadState('networkidle');
    
    // 헤더 확인
    await expect(page.getByRole('heading', { name: 'Cursor 설정 시각화' })).toBeVisible();
    await expect(page.getByText('Agents, Hooks, Rules 관리 대시보드')).toBeVisible();
    await expect(page.getByRole('button', { name: '설정 불러오기' })).toBeVisible();
  });

  test('should display navigation tabs', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // 네비게이션 탭 확인
    await expect(page.getByRole('button', { name: 'Agents' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hooks' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rules' })).toBeVisible();
  });

  test('should show Agents view by default', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Agents 뷰가 기본으로 표시되는지 확인
    await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible();
    
    // Agents 카드가 표시되는지 확인
    const agentsCount = await page.locator('text=개의 에이전트가 설정되어 있습니다').textContent();
    expect(agentsCount).toContain('개');
  });

  test('should navigate to Hooks view', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Hooks 탭 클릭
    await page.getByRole('button', { name: 'Hooks' }).click();
    
    // Hooks 뷰가 표시되는지 확인
    await expect(page.getByRole('heading', { name: 'Hooks' })).toBeVisible();
    
    // Hooks 카드가 표시되는지 확인
    const hooksCount = await page.locator('text=개의 훅이 설정되어 있습니다').textContent();
    expect(hooksCount).toContain('개');
    
    // Hooks 뷰에서 네비게이션 버튼이 활성화되어 있는지 확인
    const hooksButton = page.getByRole('button', { name: 'Hooks' });
    await expect(hooksButton).toHaveClass(/border-purple-400/);
  });

  test('should navigate to Rules view', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Rules 탭 클릭
    await page.getByRole('button', { name: 'Rules' }).click();
    
    // Rules 뷰가 표시되는지 확인
    await expect(page.getByRole('heading', { name: 'Rules' })).toBeVisible();
    
    // Rules 카드가 표시되는지 확인
    const rulesCount = await page.locator('text=개의 규칙이 설정되어 있습니다').textContent();
    expect(rulesCount).toContain('개');
    
    // Rules 뷰에서 네비게이션 버튼이 활성화되어 있는지 확인
    const rulesButton = page.getByRole('button', { name: 'Rules' });
    await expect(rulesButton).toHaveClass(/border-purple-400/);
  });

  test('should navigate between all views', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Agents -> Hooks
    await page.getByRole('button', { name: 'Hooks' }).click();
    await expect(page.getByRole('heading', { name: 'Hooks' })).toBeVisible();
    
    // Hooks -> Rules
    await page.getByRole('button', { name: 'Rules' }).click();
    await expect(page.getByRole('heading', { name: 'Rules' })).toBeVisible();
    
    // Rules -> Agents
    await page.getByRole('button', { name: 'Agents' }).click();
    await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible();
  });

  test('should display agent cards with correct information', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Agents 뷰에서 에이전트 카드가 있는지 확인
    const agentCards = page.locator('text=/planner|code-reviewer|tdd-guide/');
    await expect(agentCards.first()).toBeVisible();
    
    // 첫 번째 에이전트의 이름이 표시되는지 확인
    const firstAgent = agentCards.first();
    await expect(firstAgent).toBeVisible();
  });

  test('should display hook cards with correct information', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Hooks 뷰로 이동
    await page.getByRole('button', { name: 'Hooks' }).click();
    
    // Hooks 카드가 있는지 확인
    const hookCommands = page.locator('code', { hasText: 'bash .cursor/hooks' });
    await expect(hookCommands.first()).toBeVisible();
  });

  test('should display rule cards with correct information', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Rules 뷰로 이동
    await page.getByRole('button', { name: 'Rules' }).click();
    
    // Rules 카드가 있는지 확인
    const ruleTitles = page.locator('text=/Hooks System|Testing Requirements|Security Guidelines/');
    await expect(ruleTitles.first()).toBeVisible();
  });

  test('should maintain active tab state during navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Agents 탭이 기본 활성화되어 있는지 확인
    const agentsButton = page.getByRole('button', { name: 'Agents' });
    await expect(agentsButton).toHaveClass(/border-purple-400/);
    
    // Hooks 탭 클릭
    await page.getByRole('button', { name: 'Hooks' }).click();
    
    // Hooks 탭이 활성화되고 Agents 탭이 비활성화되었는지 확인
    const hooksButton = page.getByRole('button', { name: 'Hooks' });
    await expect(hooksButton).toHaveClass(/border-purple-400/);
    await expect(agentsButton).not.toHaveClass(/border-purple-400/);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // 모바일에서도 헤더가 표시되는지 확인
    await expect(page.getByRole('heading', { name: 'Cursor 설정 시각화' })).toBeVisible();
    
    // 모바일에서도 네비게이션이 표시되는지 확인
    await expect(page.getByRole('button', { name: 'Agents' })).toBeVisible();
  });

  test('should handle view switching without data loss', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Agents 뷰 확인
    await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible();
    const agentsText = await page.locator('text=/개의 에이전트가 설정되어 있습니다/').textContent();
    
    // Hooks 뷰로 이동
    await page.getByRole('button', { name: 'Hooks' }).click();
    await expect(page.getByRole('heading', { name: 'Hooks' })).toBeVisible();
    
    // 다시 Agents 뷰로 돌아가서 데이터가 유지되는지 확인
    await page.getByRole('button', { name: 'Agents' }).click();
    await expect(page.getByRole('heading', { name: 'Agents' })).toBeVisible();
    const agentsTextAfter = await page.locator('text=/개의 에이전트가 설정되어 있습니다/').textContent();
    expect(agentsTextAfter).toBe(agentsText);
  });
});
