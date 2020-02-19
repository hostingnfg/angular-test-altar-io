import {Component, OnDestroy, OnInit} from '@angular/core';
import {GeneratorService} from '../../services/generator.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Clock} from '../../models/clock';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject, timer} from 'rxjs';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit, OnDestroy {
  destroy: Subject<boolean> = new Subject<boolean>();
  clock: Clock;
  grid: Map<number, Map<number, string>>;
  code: string;
  headerTable = new Array(11);
  form = this.builder.group({
    char: ['', [
      Validators.pattern('[a-z]')
    ]]
  });

  constructor(private generatorService: GeneratorService, private builder: FormBuilder) { }

  ngOnInit(): void {
    this.generatorService.gridState.pipe(takeUntil(this.destroy)).subscribe((grid: Map<number, Map<number, string>>) => {
      this.grid = grid;
    });
    this.generatorService.clock.pipe(takeUntil(this.destroy)).subscribe((clock: Clock) => {
      this.clock = clock;
    });
    this.generatorService.code.pipe(takeUntil(this.destroy)).subscribe((code: string) => {
      this.code = code;
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  charChanged() {
    if (this.form.valid && this.form.controls.char.value) {
      this.generatorService.char = this.form.controls.char.value;
      this.form.controls.char.disable();
      timer(4000)
        .subscribe(() => this.form.controls.char.enable());
    } else {
      this.generatorService.char = '';
    }
  }

  generate() {
    this.generatorService.generate(this.form.controls.char.valid ? this.form.controls.char.value : '');
  }

}
