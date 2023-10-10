import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowProviderService {
  public get window(): Window {
    return window;
  }
}
