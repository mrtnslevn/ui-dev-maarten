import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numeric]'
})
export class NumericDirective implements OnInit {

  constructor(private model: NgControl, private decimalPipe: DecimalPipe,
    private ref: ElementRef) { }

  ngOnInit() {
    this.model.control?.valueChanges.subscribe(
      (value: string) => {
        try {
          
          if (value != "") {
            this.formatValue(value);
          }
        } catch {

        }
      }
    )
  }

  numbers: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']

  formatValue(value: string) {
    value = value.toString()
    const pos = this.ref.nativeElement.selectionStart;
    
    let withComma = ""
    let noComma = ""
    let lastValue = ""

    let dotCounter = 0
    for (let i = 0; i < value.length; i++) {
      let v = value[i]

      if (v == ".") dotCounter++;

      if (i == value.length - 1) {
        lastValue = v
        if (!this.numbers.includes(v)) continue
        if (dotCounter > 1) continue
      }

      withComma += v
      if (v != ",") noComma += v
    }

    const newValue = this.decimalPipe.transform(noComma, ".0-4");

    this.model.control?.setValue(Number(noComma), { emitEvent: false, onlySelf: true });
    if (lastValue == ".") this.model.valueAccessor?.writeValue(withComma);
    else this.model.valueAccessor?.writeValue(newValue);

    this.setPosition(withComma, newValue!, pos)
  }

  setPosition(getValue: string, newValue: string, pos: any) {
    const count = (newValue?.match(/,/g) || []).length;

    if (getValue.length == pos) {
      this.ref.nativeElement.selectionStart = pos + count;
      this.ref.nativeElement.selectionEnd = pos + count;
    } else {
      this.ref.nativeElement.selectionStart = pos;
      this.ref.nativeElement.selectionEnd = pos;
    }
  }
}
