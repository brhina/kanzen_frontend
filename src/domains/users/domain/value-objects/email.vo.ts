export class EmailVO {
  private readonly value: string;

  constructor(email: string) {
    const trimmed = email.trim().toLowerCase();
    if (!EmailVO.isValid(trimmed)) {
      throw new Error(`Invalid email address format: ${email}`);
    }
    this.value = trimmed;
  }

  public getValue(): string {
    return this.value;
  }

  public static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public equals(other: EmailVO): boolean {
    return this.value === other.getValue();
  }
}
