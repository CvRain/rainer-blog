import { Component, inject, OnInit } from "@angular/core";
import { MiniHeader } from "../../components/mini-header/mini-header";
import { SimpleFooter } from "../../components/simple-footer/simple-footer";
import { RouterOutlet, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { TotalOverview } from "../../services/types";
import { User } from "../../services/user";
import { DashboardSidebar } from "../../components/dashboard-sidebar/dashboard-sidebar";

@Component({
  selector: "app-dashboard",
  imports: [
    MiniHeader,
    SimpleFooter,
    RouterOutlet,
    CommonModule,
    ButtonModule,
    TooltipModule,
    DashboardSidebar,
  ],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.css",
})
export class Dashboard implements OnInit {
  userService = inject(User);
  router = inject(Router);

  sidebarVisible = true;

  totalView: TotalOverview = {} as TotalOverview;

  ngOnInit(): void {
    this.loadTotalOverview();
  }

  loadTotalOverview() {
    this.userService.totalOverview().subscribe((res) => {
      if (res.code === 200) {
        this.totalView = res.data || ({} as TotalOverview);
        console.log(this.totalView);
      }
    });
  }

  onChildActivate(instance: any) {
    if (
      instance &&
      "setTotalView" in instance &&
      typeof instance.setTotalView === "function"
    ) {
      instance.setTotalView(this.totalView);
    }
  }
}
