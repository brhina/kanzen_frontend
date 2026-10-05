import { NewsletterSubscriberStatus } from '../enums/newsletter-status.enum';

export interface NewsletterSubscriberProps {
  id?: string;
  email: string;
  firstName?: string;
  source?: string;
  tags?: string[];
  isConfirmed?: boolean;
  status?: NewsletterSubscriberStatus;
  confirmedAt?: Date;
  unsubscribedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NewsletterSubscriberEntity {
  public id?: string;
  public email: string;
  public firstName?: string;
  public source: string;
  public tags: string[];
  public isConfirmed: boolean;
  public status: NewsletterSubscriberStatus;
  public confirmedAt?: Date;
  public unsubscribedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: NewsletterSubscriberProps) {
    this.id = props.id;
    this.email = props.email;
    this.firstName = props.firstName;
    this.source = props.source ?? 'homepage';
    this.tags = props.tags ?? [];
    this.isConfirmed = Boolean(props.isConfirmed);
    this.status = props.status ?? NewsletterSubscriberStatus.PENDING;
    this.confirmedAt = props.confirmedAt;
    this.unsubscribedAt = props.unsubscribedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
