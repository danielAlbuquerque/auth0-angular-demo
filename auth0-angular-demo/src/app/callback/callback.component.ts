import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    const client = await this.authService.getAuth0Client();

    // Handle the redirect from Auth0
    const result = await client.handleRedirectCallback();

    // Get the URL the user was originally trying to reach
    const targetRoute =
      result.appState && result.appState.target ? result.appState.target : '';

    // Update observables
    this.authService.isAuthenticated.next(await client.isAuthenticated());
    this.authService.profile.next(await client.getUser())

    // Redirect away
    this.router.navigate([targetRoute]);
  }
}
