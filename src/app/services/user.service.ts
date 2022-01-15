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
    return this.currentUser.id
  }

  getLocalUpvotedComments(): number[] {
    const localUpvotedComments = localStorage.getItem('upvoted_comments')
    if (!localUpvotedComments) this.setLocalUpvotedComments([])
    return JSON.parse(localUpvotedComments || '[]')
  }

  setLocalUpvotedComments(upvotes: number[]): void {
    localStorage.setItem('upvoted_comments', JSON.stringify(upvotes))
  }

  addToLocalUpvotedComments(id: number): void {
    const localUpvotedComments = localStorage.getItem('upvoted_comments')
    let upvotesArray = JSON.parse(localUpvotedComments || '[]')
    upvotesArray.push(id)
    this.setLocalUpvotedComments(upvotesArray)
  }

  removeFromLocalUpvotedComments(id: number): void {
    const localUpvotedComments = localStorage.getItem('upvoted_comments')
    let upvotesArray: number[] = JSON.parse(localUpvotedComments || '[]')
    upvotesArray = upvotesArray.filter(u => u !== id)
    this.setLocalUpvotedComments(upvotesArray)
  }

  getLocalDownvotedComments(): number[] {
    const localDownvotedComments = localStorage.getItem('downvoted_comments')
    if (!localDownvotedComments) this.setLocalDownvotedComments([])
    return JSON.parse(localDownvotedComments || '[]')
  }

  setLocalDownvotedComments(downvotes: number[]): void {
    localStorage.setItem('downvoted_comments', JSON.stringify(downvotes))
  }

  addToLocalDownvotedComments(id: number): void {
    const localDownvotedComments = localStorage.getItem('downvoted_comments')
    let downvotesArray = JSON.parse(localDownvotedComments || '[]')
    downvotesArray.push(id)
    this.setLocalDownvotedComments(downvotesArray)
  }

  removeFromLocalDownvotedComments(id: number): void {
    const localDownvotedComments = localStorage.getItem('downvoted_comments')
    let downvotesArray: number[] = JSON.parse(localDownvotedComments || '[]')
    downvotesArray = downvotesArray.filter(u => u !== id)
    this.setLocalDownvotedComments(downvotesArray)
  }
}
