import { ContactStatus } from '../enums/contact-status.enum';
import { ContactType } from '../enums/contact-type.enum';

export interface ContactProps {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: ContactType;
  status?: ContactStatus;
  readAt?: Date;
  repliedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContactEntity {
  public id?: string;
  public name: string;
  public email: string;
  public phone?: string;
  public subject: string;
  public message: string;
  public type: ContactType;
  public status: ContactStatus;
  public readAt?: Date;
  public repliedAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: ContactProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.subject = props.subject;
    this.message = props.message;
    this.type = props.type ?? ContactType.GENERAL;
    this.status = props.status ?? ContactStatus.PENDING;
    this.readAt = props.readAt;
    this.repliedAt = props.repliedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
