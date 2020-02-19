import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Payment} from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  get payments(): BehaviorSubject<Payment[]> {
    return this._payments;
  }

  private readonly _payments = new BehaviorSubject<Payment[]>([]);

  constructor() {
    const payments = localStorage.getItem('payments');
    if (payments) {
      const next = JSON.parse(payments).map(payment => {
        payment.grid = new Map<number, Map<number, string>>(payment.grid.map(([key, value]) => {
          return [key, new Map<number, string>(value)];
        }));
        return payment;
      });
      this.payments.next(next);
    }
  }

  public add(payment: Payment) {
    const next = this.payments.getValue();
    next.push(payment);
    this.payments.next(next);
    localStorage.setItem('payments', JSON.stringify(next.map(e => {
      return {
        ...e,
        grid: [...e.grid.entries()].map(([key, value]) => {
          return [key, [...value.entries()]];
        })
      };
    })));
  }
}
