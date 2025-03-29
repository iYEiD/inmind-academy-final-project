import { NgModule, APP_INITIALIZER, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { FeaturesModule } from './features/features.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { StoreModule } from '@ngrx/store';
import { cartReducer } from './shared/states/shopping-cart/cart.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { userReducer } from './shared/states/user/user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './shared/states/user/user.effects';
import { AccountFacade } from './core/authentication/facades/account.facade';
import { AuthService } from './core/authentication/services/auth.service';
import { ServiceWorkerModule } from '@angular/service-worker';

// Factory function for APP_INITIALIZER
function initializeUserState(
  authService: AuthService,
  accountFacade: AccountFacade
) {
  return () => {
    if (authService.isAuthenticated()) {
      accountFacade.loadUserProfile();
    }
    return Promise.resolve();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    FeaturesModule,
    HttpClientModule,
    StoreModule.forRoot({ cart: cartReducer, user: userReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    EffectsModule.forRoot([UserEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeUserState,
      deps: [AuthService, AccountFacade],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
