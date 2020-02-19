import {Component, OnDestroy, OnInit} from '@angular/core';
import {GeneratorService} from '../../services/generator.service';
import {FormBuilder, Validators} from '@angular/forms';
import {PaymentService} from '../../services/payment.service';
import {Payment} from '../../models/payment';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {
  code: string;
  grid: Map<number, Map<number, string>>;
  destroy: Subject<boolean> = new Subject<boolean>();

  displayedColumns: string[] = ['payment', 'amount', 'code', 'grid'];
  dataSource = new MatTableDataSource<Payment>();

  form = this.builder.group({
    payment: ['', [
      Validators.pattern('[a-z]*'),
      Validators.required
    ]],
    amount: ['', [
      Validators.pattern('[0-9]*'),
      Validators.required
    ]]
  });

  constructor(
    private generatorService: GeneratorService,
    private builder: FormBuilder,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.generatorService.code.pipe(takeUntil(this.destroy)).subscribe((code: string) => {
      this.code = code;
    });
    this.generatorService.gridState.pipe(takeUntil(this.destroy)).subscribe((grid: Map<number, Map<number, string>>) => {
      this.grid = grid;
    });
    this.paymentService.payments.pipe(takeUntil(this.destroy)).subscribe((payments: Payment[]) => {
      this.dataSource.data = payments;
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public add() {
    this.paymentService.add({
      amount: this.form.controls.amount.value,
      code: this.code,
      grid: this.grid,
      payment: this.form.controls.payment.value
    } as Payment);
  }
}
