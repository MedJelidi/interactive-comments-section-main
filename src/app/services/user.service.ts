import { Injectable } from '@angular/core'
import myData from '../../assets/data.json'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: any
  constructor() {
    // @ts-ignore
    myData.currentUser.id = 1
    this.currentUser = myData.currentUser
    console.log(this.currentUser)
  }

  getUserID(): number {
    return  this.currentUser.id
  }
}
