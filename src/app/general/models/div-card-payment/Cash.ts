export interface Cash {
  cash_amount: number;
  change: number;
}

export class Cash {
  static default(): Cash {
    return {
      cash_amount: 0,
      change: 0
    }
  }
}