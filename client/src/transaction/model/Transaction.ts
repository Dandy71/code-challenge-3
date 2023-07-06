export class Transaction {
  id!: number;
  moneyFrom!: number;
  moneyTo!: number;
  curFrom!: string;
  curTo!: string;
  isBuyingTo!: boolean;
  fee!: number;
  create_time!: Date;

  constructor(transaction: Partial<Transaction>) {
    Object.assign(this, transaction);
  }

  get symbol(): string {
    return this.curFrom + " => " + this.curTo;
  }

  get feePresnt(): string {
    return this.fee + " " + (this.isBuyingTo ? this.curTo : this.curFrom);
  }
}
