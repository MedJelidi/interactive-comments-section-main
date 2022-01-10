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
}
