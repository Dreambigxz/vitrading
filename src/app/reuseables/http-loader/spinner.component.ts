import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderService } from './loader.service';
import { Observable, of} from 'rxjs';

// <div class="spinner"></div>
// <div *ngIf="isLoading | async" class="spinner-overlay"> <div class="spinner"></div> </div>
@Component({
  selector: 'app-spinner',
  imports: [ CommonModule],

  template: `
    <div *ngIf="isLoading | async" class="spinner-overlay">

    <div class="logo-container">

      <div class="glow-ring"></div>

      <img src="assets/img/favicon.svg"
           alt="App Logo"
           class="logo-float" />

    </div>

    <div class="loading-text">
      Securing connection...
    </div>

  </div>
`,
styles: [`

  /* overlay */

  .spinner-overlay {
    position: fixed;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

  /*  background: radial-gradient(circle at center,#1c1b2e,#0b0a16); */

    backdrop-filter: blur(1px);
    z-index: 2000;

    overflow:hidden;

  }


  /* container */

  .logo-container{
    position: relative;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .loading-text{
    position:absolute;
    bottom:35%;
    font-size:13px;
    color:#9ca3af;
    letter-spacing:.4px;
    animation: fadePulse 1.6s infinite;
  }

  @keyframes fadePulse{
    0%,100%{opacity:.4}
    50%{opacity:1}
  }


  /* glow ring */

  .glow-ring{
    position:absolute;

    width:110px;
    height:110px;

    border-radius:50%;

    background: radial-gradient(circle,
      rgba(108,92,231,.6),
      rgba(108,92,231,.15),
      transparent
    );

    animation: pulseGlow 2s ease-in-out infinite;
  }


  /* logo */

  .logo-float{
    width:70px;
    max-width:35vw;

    z-index:2;

    filter: drop-shadow(0 0 10px rgba(108,92,231,.6));

    animation: logoFloat 2.2s ease-in-out infinite;
  }


  /* float animation */

  @keyframes logoFloat{
    0%,100%{
      transform: translateY(0);
    }
    50%{
      transform: translateY(-10px);
    }
  }


  /* glow pulse */

  @keyframes pulseGlow{
    0%,100%{
      transform: scale(.9);
      opacity:.6;
    }

    50%{
      transform: scale(1.2);
      opacity:.2;
    }
  }


  /* mobile */

  @media (max-width:480px){

    .logo-float{
      width:55px;
    }

    .glow-ring{
      width:90px;
      height:90px;
    }

  }

  `]
})
export class SpinnerComponent {
    isLoading: Observable<boolean>;
   constructor(private loaderService: LoaderService) {
     this.isLoading = this.loaderService.loading$; // ✅ safe
   }

}
