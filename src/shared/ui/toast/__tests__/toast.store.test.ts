import { beforeEach, describe, expect, it } from 'vitest';
import { toast, useToastStore } from '../toast.store';

describe('Toast Store', () => {
  beforeEach(() => {
    useToastStore.getState().clearAll();
  });

  it('adds toast notifications correctly', () => {
    toast.success('Service created successfully', 'Success');
    let toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Service created successfully');
    expect(toasts[0].title).toBe('Success');

    toast.error('Failed to update post');
    toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(2);
    expect(toasts[1].type).toBe('error');
  });

  it('removes a specific toast via dismiss', () => {
    const id = toast.info('System notification');
    expect(useToastStore.getState().toasts.length).toBe(1);

    toast.dismiss(id);
    expect(useToastStore.getState().toasts.length).toBe(0);
  });
});
