import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { ToastComponent } from './toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {

  appRef = inject(ApplicationRef)
  injector = inject(EnvironmentInjector)

  show(data:any){

    const componentRef = createComponent(ToastComponent,{
      environmentInjector:this.injector
    })

    componentRef.instance.message = data.message
    componentRef.instance.type = data.status || 'info'

    const duration = data.duration || 2500

    this.appRef.attachView(componentRef.hostView)

    const domElem = (componentRef.hostView as any).rootNodes[0]

    document.body.appendChild(domElem)

    setTimeout(()=>{
      this.appRef.detachView(componentRef.hostView)
      componentRef.destroy()
    },duration)

  }

}
