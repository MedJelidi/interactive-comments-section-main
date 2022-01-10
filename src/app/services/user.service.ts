import { Injectable } from '@angular/core'
import myData from '../../assets/data.json'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: any
  constructor() {
    this.currentUser = myData.currentUser
  }
}
