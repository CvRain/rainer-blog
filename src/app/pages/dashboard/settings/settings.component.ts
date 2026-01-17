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
import { DialogModule } from 'primeng/dialog';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

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
    DialogModule,
    ImageCropperComponent,
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

  // Cropper State
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCropperVisible = false;
  currentField: 'user_avatar' | 'user_background' | null = null;
  cropperAspectRatio = 1;
  cropperResizeToWidth = 256;

  ngOnInit() {
    this.loadUserInfo();
  }

  onFileSelected(event: any, field: 'user_avatar' | 'user_background') {
    this.imageChangedEvent = event;
    this.currentField = field;
    this.isCropperVisible = true;

    if (field === 'user_avatar') {
      this.cropperAspectRatio = 1 / 1;
      this.cropperResizeToWidth = 200;
    } else {
      this.cropperAspectRatio = 16 / 9;
      this.cropperResizeToWidth = 1200;
    }
    // const file = event.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     this.userInfo[field] = e.target.result;
    //   };
    //   reader.readAsDataURL(file);
    // }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
    // If you need Blob: event.blob
    // But our API expects Base64 for now, or objectUrl?
    // Wait, the API example showed "data:image/png;base64,..."
    // image-cropper provides base64 in event.base64 (deprecated?) or we convert blob/objectUrl.
    // Actually event.base64 is deprecated. We should use blob and convert?
    // Or just use objectUrl for preview and convert blob to base64 on save.
    // For simplicity, let's see what the event provides.
    // Recent versions removed base64 property.
    // We should convert blob to base64.
    if (event.blob) {
      const reader = new FileReader();
      reader.onload = () => {
        this.croppedImage = reader.result; // This is the Base64 string
      };
      reader.readAsDataURL(event.blob);
    }
  }

  saveCrop() {
    if (this.currentField && this.croppedImage) {
      this.userInfo[this.currentField] = this.croppedImage;
    }
    this.isCropperVisible = false;
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  cancelCrop() {
    this.isCropperVisible = false;
    this.imageChangedEvent = '';
    this.croppedImage = '';
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
