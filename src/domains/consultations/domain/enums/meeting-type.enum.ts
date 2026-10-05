export const MeetingType = {
  VIDEO: 'video',
  PHONE: 'phone',
  IN_PERSON: 'in-person',
} as const;

export type MeetingType = (typeof MeetingType)[keyof typeof MeetingType];
