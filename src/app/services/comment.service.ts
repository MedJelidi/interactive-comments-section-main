import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {BehaviorSubject, Observable} from 'rxjs'
import { Comment } from '../models/comment.model'
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  url = 'https://localhost:8000/'
  deleted = new BehaviorSubject<any>({})
  constructor(private httpClient: HttpClient) {}

  getParentComments(): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(this.url + 'parent_comments')
  }

  getRepliesOfComment(parentID: number): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${this.url}replies/${parentID}`)
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.httpClient.post<Comment>(this.url + 'comment', comment)
  }

  deleteComment(id: number): Observable<Comment> {
    return this.httpClient.delete<Comment>(this.url + 'delete_comment/' + id)
  }

  updateComment(id: number, content: string): Observable<Comment> {
    return this.httpClient.put<Comment>(this.url + 'update_comment/' + id, {content})
  }

  onDelete(modal: any, id: number, isReply: boolean): void {
    modal.classList.add('shown')
    const modalContainer = document.querySelector('.modal-container')

    const modalClick = (e: any) => {
      if (e.target !== modal) return; // Do nothing
      modal.classList.remove('shown')
      modal.removeEventListener('click', modalClick)
      confirmButton?.removeEventListener('click', confirmDeletion)
      cancelButton?.removeEventListener('click', cancelDeletion)
    }
    modal.addEventListener('click', modalClick)

    const confirmButton = modalContainer?.querySelector('.confirm')
    const cancelButton = modalContainer?.querySelector('.cancel')
    const confirmDeletion = () => {
      this.deleteComment(id).pipe(
        take(1)
      ).subscribe(
        () => {
          this.deleted.next({id, isReply})
          modal.classList.remove('shown')
          modal.removeEventListener('click', modalClick)
          confirmButton?.removeEventListener('click', confirmDeletion)
          cancelButton?.removeEventListener('click', cancelDeletion)
        },
        () => {
          this.deleted.next({id, isReply})
          modal.classList.remove('shown')
          modal.removeEventListener('click', modalClick)
          confirmButton?.removeEventListener('click', confirmDeletion)
          cancelButton?.removeEventListener('click', cancelDeletion)
        })
    }
    const cancelDeletion = () => {
      modal.classList.remove('shown')
      modal.removeEventListener('click', modalClick)
      confirmButton?.removeEventListener('click', confirmDeletion)
      cancelButton?.removeEventListener('click', cancelDeletion)
    }
    confirmButton?.addEventListener('click', confirmDeletion)
    cancelButton?.addEventListener('click', cancelDeletion)
  }

  getCommentsFromLocalStorage(): Comment[] {
    if (!localStorage.getItem('parent_comments')) this.setCommentsInLocalStorage()
    return JSON.parse(<string>localStorage.getItem('parent_comments'))
  }

  setCommentsInLocalStorage() {
    localStorage.setItem('parent_comments', JSON.stringify(
      [
        {
          "id": 1,
          "content": "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. "
            + "You\u0027ve nailed the design and the responsiveness at various breakpoints works really well.",
          "createdAt":"2022-01-09 13:59:47",
          "parentID": -1,
          "score":12,
          "commenter": {
            "id": 2,
            "username": "amyrobson",
            "image": {
              "id": 2,
              "png": "./images/avatars/image-amyrobson.png",
              "webp": "./images/avatars/image-amyrobson.webp"
            }
          }
        },
        {
          "id": 2,
          "content": "Woah, your project looks awesome! How long have you been coding for? I\u0027m still new, " +
            "but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn " +
            "React? Thanks!",
          "createdAt": "2022-01-09 14:04:00",
          "parentID": -1,
          "score": 5,
          "commenter": {
            "id": 3,
            "username": "maxblagun",
            "image": {
              "id": 3,
              "png":"./images/avatars/image-maxblagun.png",
              "webp":"./images/avatars/image-maxblagun.webp"
            }
          }
        },
        {
          "id": 8,
          "content": "You\u0027ve nailed the design and the responsiveness at various breakpoints works really well.",
          "createdAt": "2022-01-10 17:35:27",
          "parentID": -1,
          "score": 0,
          "commenter": {
            "id": 1,
            "username": "juliusomo",
            "image": {
              "id": 1,
              "png": "./images/avatars/image-juliusomo.png",
              "webp":"./images/avatars/image-juliusomo.webp"
            }
          }
        }
      ]
    ))
  }

  addToLocalComments(comment: Comment): void {
    const localComments = JSON.parse(<string>localStorage.getItem('parent_comments'))
    localComments.push(comment)
    localStorage.setItem('parent_comments', JSON.stringify(localComments))
  }

  updateLocalComment(id: number, newContent: string, upvote: string): void {
    const localComments = this.getCommentsFromLocalStorage()
    const commentToUpdate = localComments.findIndex(c => c.id === id)
    if (newContent !== '') localComments[commentToUpdate].content = newContent
    if (upvote !== '') localComments[commentToUpdate].score += (upvote === 'up' ? 1 : -1)
    localStorage.setItem('parent_comments', JSON.stringify(localComments))
  }

  deleteFromLocalComments(id: number): void {
    const localComments = this.getCommentsFromLocalStorage()
    const newComments = localComments.filter(c => c.id !== id)
    localStorage.setItem('parent_comments', JSON.stringify(newComments))
  }

}
