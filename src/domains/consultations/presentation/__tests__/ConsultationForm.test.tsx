import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ConsultationForm } from '../components/ConsultationForm';
import { ConsultationType } from '../../domain/enums/consultation-type.enum';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';
import { DeliveryFormat } from '../../domain/enums/delivery-format.enum';
import { MeetingType } from '../../domain/enums/meeting-type.enum';

describe('ConsultationForm', () => {
  it('renders admin creation form for corporate training by default', () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    const html = renderToStaticMarkup(
      <ConsultationForm
        defaultType="training"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );

    // Form headers & badges
    expect(html).toContain('Offering Type *');
    expect(html).toContain('Corporate Training');
    expect(html).toContain('1-on-1 Consultation');
    expect(html).toContain('Lifecycle Status *');
    expect(html).toContain('Cohort Headcount *');

    // Client profile
    expect(html).toContain('Client &amp; Organization Details');
    expect(html).toContain('Client / Contact Name *');
    expect(html).toContain('Client Work Email *');

    // Training curriculum track
    expect(html).toContain('Curriculum Track / Training Topic *');
    expect(html).toContain('Enterprise Cloud &amp; Kubernetes Engineering Masterclass');

    // Logistics & virtual bridge
    expect(html).toContain('Schedule &amp; Virtual Bridge Logistics');
    expect(html).toContain('Meeting Link / Sandbox Lab Portal URL');
    expect(html).toContain('Internal Staff Briefing &amp; Lab Provisioning Notes');
    expect(html).toContain('Schedule Corporate Training');
  });

  it('renders pre-populated values when editing an existing scheduled session', () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();

    const mockItem = {
      id: 'session-123',
      name: 'Marcus Vance',
      email: 'marcus.vance@apex-fin.tech',
      company: 'Apex Financial Systems',
      projectDescription: 'Corporate Kubernetes training for 18 staff engineers',
      serviceInterest: ['cloud-architecture-devops'],
      type: ConsultationType.TRAINING,
      attendeesCount: 18,
      trainingTopic: 'Enterprise Cloud & Kubernetes Engineering Masterclass',
      deliveryFormat: DeliveryFormat.VIRTUAL_INTERACTIVE,
      meetingType: MeetingType.VIDEO,
      meetingLink: 'https://meet.veyroo.tech/training-k8s-masterclass-apex',
      status: ConsultationStatus.SCHEDULED,
      notes: 'Dedicated sandbox clusters allocated.',
      timezone: 'America/New_York',
    };

    const html = renderToStaticMarkup(
      <ConsultationForm
        initialData={mockItem as any}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );

    expect(html).toContain('Marcus Vance');
    expect(html).toContain('marcus.vance@apex-fin.tech');
    expect(html).toContain('Apex Financial Systems');
    expect(html).toContain('https://meet.veyroo.tech/training-k8s-masterclass-apex');
    expect(html).toContain('Dedicated sandbox clusters allocated.');
    expect(html).toContain('Save Changes');
  });
});
