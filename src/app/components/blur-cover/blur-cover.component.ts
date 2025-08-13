import { Component, input, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { LucideAngularModule, GitPullRequest, LucideIconData, TvIcon } from 'lucide-angular';

export interface SocialLink {
  url: string;
  icon: LucideIconData;
  label: string;
}

@Component({
  selector: 'app-blur-cover',
  imports: [
    ImageModule, LucideAngularModule
  ],
  templateUrl: './blur-cover.component.html',
  styleUrl: './blur-cover.component.css'
})
export class BlurCoverComponent implements OnInit {
  ngOnInit(): void {

  }
  readonly Code = GitPullRequest;
  readonly TvIcon = TvIcon;

  imageUrl = input('images/placeholder.jpg');
  title = input('笨拙的探索这个世界');
  description = input('std::find(world.beg(),world.end())');
  socialLinks = input<SocialLink[]>([
    { url: 'https://github.com', icon: this.Code, label: 'GitHub' },
    { url: 'https://bilibili.com', icon: this.TvIcon, label: 'Bilibili' }
  ]);
  showScrollIndicator = input(true);
}
