import { Component } from '@angular/core';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { SimpleFooter } from "../../components/simple-footer/simple-footer";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  imports: [MiniHeader, SimpleFooter, RouterOutlet, CommonModule, PanelMenuModule, CardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  items: MenuItem[] = [
    {
      label: '博客总览',
      icon: 'pi pi-home',
      routerLink: ['/dashboard/overview']
    },
    {
      label: '主题管理',
      icon: 'pi pi-book',
      routerLink: ['/dashboard/themes'],
      items: [
        { label: '全部主题', icon: 'pi pi-list', routerLink: ['/dashboard/themes'] },
        { label: '新建主题', icon: 'pi pi-plus', routerLink: ['/dashboard/themes/new'] }
      ]
    },
    {
      label: '资源管理',
      icon: 'pi pi-folder',
      routerLink: ['/dashboard/resources'],
      items: [
        { label: '全部集合', icon: 'pi pi-box', routerLink: ['/dashboard/resources'] },
        { label: '新建集合', icon: 'pi pi-plus', routerLink: ['/dashboard/resources/new'] }
      ]
    }
  ];
}
