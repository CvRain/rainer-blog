import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../services/user';
import { UserInfo } from '../../../services/types';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    PasswordModule,
    DividerModule,
    ImageModule,
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  userService = inject(User);
  messageService = inject(MessageService);

  userInfo: Partial<UserInfo> = {};
  newPassword = '';
  loading = false;

  // To handle the visual toggle between tabs or sections if needed,
  // but we will use a single page scroll design for simplicity.

  ngOnInit() {
    this.loadUserInfo();
  }

  onFileSelected(event: any, field: 'user_avatar' | 'user_background') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userInfo[field] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addLink() {
    if (!this.userInfo.links) {
      this.userInfo.links = [];
    }
    this.userInfo.links.push({ title: '', url: '' });
  }

  removeLink(index: number) {
    if (this.userInfo.links) {
      this.userInfo.links.splice(index, 1);
    }
  }

  loadUserInfo() {
    this.loading = true;
    this.userService.getUserInfo().subscribe({
      next: (res) => {
        if (res.data) {
          this.userInfo = { ...res.data };
        }
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user info',
        });
        this.loading = false;
      },
    });
  }

  saveProfile() {
    this.loading = true;

    // Construct payload
    const payload: any = { ...this.userInfo };
    if (this.newPassword) {
      payload.user_password = this.newPassword;
    }

    this.userService.updateUserInfo(payload).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully',
        });
        if (res.data) {
          this.userInfo = { ...res.data };
          this.newPassword = ''; // clear password field
        }
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile',
        });
        this.loading = false;
      },
    });
  }
}
