export class BudgetRangeVO {
  readonly min: number;
  readonly max: number;
  readonly currency: string;

  constructor(min: number, max: number, currency: string = 'USD') {
    if (min < 0) {
      throw new Error('Minimum budget cannot be negative');
    }
    if (max < min) {
      throw new Error('Maximum budget cannot be less than minimum budget');
    }
    this.min = min;
    this.max = max;
    this.currency = currency;
  }

  isWithin(amount: number): boolean {
    return amount >= this.min && amount <= this.max;
  }

  toString(): string {
    return `${this.currency} ${this.min.toLocaleString()} - ${this.max.toLocaleString()}`;
  }
}
