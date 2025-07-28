import { Component, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-page',
  imports: [
    Button,
    CommonModule
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})

export class TestPageComponent {
  theNumber = signal(0)

  increaseNumber = ()=>{
    this.theNumber.update(x => x + 1);
  }
  decreaseNUmber = ()=>{
    this.theNumber.update(x => x - 1);
  }
  resetNumber = ()=>{
    this.theNumber.set(0)
  }
}
