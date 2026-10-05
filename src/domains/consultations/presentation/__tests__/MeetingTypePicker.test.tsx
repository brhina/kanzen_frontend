import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MeetingTypePicker } from '../components/MeetingTypePicker';
import { MeetingType } from '../../domain/enums/meeting-type.enum';

describe('MeetingTypePicker', () => {
  it('renders all meeting types correctly', () => {
    const html = renderToStaticMarkup(
      <MeetingTypePicker value={MeetingType.VIDEO} onChange={vi.fn()} />,
    );

    expect(html).toContain('Video Conference');
    expect(html).toContain('Direct Phone Call');
    expect(html).toContain('On-Site / In-Person');
  });

  it('highlights the selected meeting type', () => {
    const html = renderToStaticMarkup(
      <MeetingTypePicker value={MeetingType.PHONE} onChange={vi.fn()} />,
    );

    expect(html).toContain('border-brand-600');
  });
});
