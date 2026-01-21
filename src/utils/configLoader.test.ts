import { describe, it, expect } from 'vitest';
import { loadCursorConfig } from './configLoader';

describe('configLoader', () => {
  describe('loadCursorConfig', () => {
    it('should return a valid CursorConfig object', async () => {
      const config = await loadCursorConfig();

      expect(config).toBeDefined();
      expect(config).toHaveProperty('agents');
      expect(config).toHaveProperty('hooks');
      expect(config).toHaveProperty('rules');
    });

    it('should return agents array with correct structure', async () => {
      const config = await loadCursorConfig();

      expect(Array.isArray(config.agents)).toBe(true);
      expect(config.agents.length).toBeGreaterThan(0);

      config.agents.forEach((agent) => {
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('description');
        expect(agent).toHaveProperty('model');
        expect(agent).toHaveProperty('tools');
        expect(typeof agent.name).toBe('string');
        expect(typeof agent.description).toBe('string');
        expect(typeof agent.model).toBe('string');
        expect(Array.isArray(agent.tools)).toBe(true);
      });
    });

    it('should return hooks array with correct structure', async () => {
      const config = await loadCursorConfig();

      expect(Array.isArray(config.hooks)).toBe(true);
      expect(config.hooks.length).toBeGreaterThan(0);

      config.hooks.forEach((hook) => {
        expect(hook).toHaveProperty('type');
        expect(hook).toHaveProperty('command');
        expect(typeof hook.type).toBe('string');
        expect(typeof hook.command).toBe('string');
      });
    });

    it('should return rules array with correct structure', async () => {
      const config = await loadCursorConfig();

      expect(Array.isArray(config.rules)).toBe(true);
      expect(config.rules.length).toBeGreaterThan(0);

      config.rules.forEach((rule) => {
        expect(rule).toHaveProperty('title');
        expect(rule).toHaveProperty('content');
        expect(typeof rule.title).toBe('string');
        expect(typeof rule.content).toBe('string');
      });
    });

    it('should return consistent data on multiple calls', async () => {
      const config1 = await loadCursorConfig();
      const config2 = await loadCursorConfig();

      expect(config1.agents.length).toBe(config2.agents.length);
      expect(config1.hooks.length).toBe(config2.hooks.length);
      expect(config1.rules.length).toBe(config2.rules.length);
    });

    it('should handle empty arrays gracefully', async () => {
      const config = await loadCursorConfig();

      // 샘플 데이터가 있으므로 빈 배열이 아니어야 함
      expect(config.agents.length).toBeGreaterThan(0);
      expect(config.hooks.length).toBeGreaterThan(0);
      expect(config.rules.length).toBeGreaterThan(0);
    });

    it('should not throw errors when called', async () => {
      await expect(loadCursorConfig()).resolves.toBeDefined();
      await expect(loadCursorConfig()).resolves.not.toThrow();
    });

    it('should return agents with valid model types', async () => {
      const config = await loadCursorConfig();

      const validModels = ['opus', 'sonnet', 'haiku'];
      config.agents.forEach((agent) => {
        expect(validModels).toContain(agent.model.toLowerCase());
      });
    });

    it('should return hooks with valid types', async () => {
      const config = await loadCursorConfig();

      const validHookTypes = [
        'beforeShellExecution',
        'afterShellExecution',
        'afterFileEdit',
        'stop',
      ];

      config.hooks.forEach((hook) => {
        expect(validHookTypes).toContain(hook.type);
      });
    });
  });
});
