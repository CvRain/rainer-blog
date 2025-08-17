import { Component, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import {MiniHeader} from '../../components/mini-header/mini-header';
import {SimpleFooter} from '../../components/simple-footer/simple-footer';

@Component({
  selector: 'app-test-page',
  imports: [
    Button,
    CommonModule,
    MiniHeader,
    SimpleFooter
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})

export class TestPageComponent {

}
