import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Comment } from '../models/comment.model'

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  url = 'https://localhost:8000/'
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
}
