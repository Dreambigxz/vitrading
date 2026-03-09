import { Routes } from '@angular/router';
import { MainComponent  } from "./main/main.component";
import { ProfileComponent} from "./profile/profile.component";
import {  NotificationsComponent} from "./notifications/notifications.component";

import { LoginComponent} from "./auth/login/login.component";
import { RegisterComponent} from "./auth/register/register.component";
import { ResetComponent} from "./auth/reset/reset.component";

import {CreditAgentComponent} from './credit-agent/credit-agent.component'
import {PaymentConfirmationComponent} from './payment-confirmation/payment-confirmation.component'

import { MarketDetailsComponent } from "./market-details/market-details.component";
import { CreateAiComponent } from "./create-ai/create-ai.component";
import { PlansComponent } from "./plans/plans.component";
import { WalletComponent } from "./wallet/wallet.component";

import { InvitesComponent } from "./invites/invites.component";
import { LuckyWheelComponent } from "./lucky-wheel/lucky-wheel.component";
import { authGuard } from './reuseables/auth/auth.guard';

export const routes: Routes = [

    {
      path: '',
      component: MainComponent,
      title: 'Main',
      canActivate: [authGuard]
    },


    {
      path: 'notifications',
      component: NotificationsComponent,
      title: 'Notifications',
      canActivate: [authGuard]
    },


    {
      path: 'wallet',
      component: WalletComponent,
      title: 'wallet',
      canActivate: [authGuard]
    },

    {
      path: 'invite',
      component: InvitesComponent,
      title: 'Invited-users',
      canActivate: [authGuard]
    },

    {
      path: 'account',
      component: ProfileComponent,
      title: 'Account',
      canActivate: [authGuard]
    },

    { path: 'market-details', component: MarketDetailsComponent },

    // vi routers
    {
      path: 'vi',
      component: CreateAiComponent,
      title: 'Create-plan',
      canActivate: [authGuard]

    },
    {
      path: 'my-plan',
      component: PlansComponent,
      title: 'Plan',
      canActivate: [authGuard]

    },
    // luck wheel
    {
      path: 'lucky-wheel',
      component: LuckyWheelComponent,
      title: 'Voucher:Lucky We=heel',
      canActivate: [authGuard]

    },

    // agent administration paths
    {
      path: 'confirm-payment',
      component: PaymentConfirmationComponent,
      title: 'Confirmation',
      canActivate: [authGuard]

    },

    {
      path: 'credit-agent',
      component: CreditAgentComponent,
      title: 'Credit-Agent',
      canActivate: [authGuard]

    },
    // auth  paths (anonymous users)
    {
      path: 'login',
      component: LoginComponent,
      title: 'Login',
    },
    {
      path: 'register',
      component: RegisterComponent,
      title: 'Register',
    },
    {
      path: 'reset-password',
      component: ResetComponent,
      title: 'Reset',
    },

];
