import { Component, OnInit } from '@angular/core';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  profile: any;

  private auth0Client: Auth0Client;

  /**
   * Constructor - inject the AuthService class
   */
  constructor(private authService: AuthService) {}

  /**
   * Handle component initialization
   */
  async ngOnInit() {
    try {
      this.auth0Client = await this.authService.getAuth0Client();
    } catch(ex) {
      console.log(ex);
    }
    // Get an instance of the Auth0 client

    // Watch for changes to the isAuthenticated state
    this.authService.isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });

    // Watch for changes to the profile data
    this.authService.profile.subscribe(profile => {
      this.profile = profile;
    });
  }

  /**
   * Logs in the user by redirecting to Auth0 for authentication
   */
  async login() {
    await this.auth0Client.loginWithRedirect({
      redirect_uri: `${window.location.origin}/callback`
    });
  }

  /**
   * Logs the user out of the applicaion, as well as on Auth0
   */
  logout() {
    this.auth0Client.logout({
      client_id: this.authService.config.client_id,
      returnTo: window.location.origin
    });
  }
}
