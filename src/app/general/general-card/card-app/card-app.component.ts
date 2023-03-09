import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-app',
  templateUrl: './card-app.component.html',
  styleUrls: ['./card-app.component.scss']
})
export class CardAppComponent implements OnInit {

  @Input() title = '';

  public color : string = 'primary'
  
  private _show: boolean = true;
  @Input() set show(value: boolean) {
    this._show = value;
    this.toggleIcon();
  }
  get show() { return this._show }

  public nameIcon : string = 'cil-chevron-circle-up-alt';
  constructor() { }

  ngOnInit(): void {
    this.toggleIcon();
  }

  showContent() : void {
    this.show = !this.show;
    this.toggleIcon();
  }

  toggleIcon(): void {
    if (this.show) {
      this.nameIcon = 'cil-chevron-circle-up-alt';
    } else {
      this.nameIcon = 'cil-chevron-circle-down-alt';
    }
  }
}
