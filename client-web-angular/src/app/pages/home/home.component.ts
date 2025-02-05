import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { effect } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  currentTime: Date = new Date();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      this.user = this.authService.currentUser();
    });
  }

  ngOnInit() {
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
