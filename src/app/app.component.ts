import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { CommentService } from './services/comment.service'
import { Comment } from './models/comment.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'interactive-comments-section-main'
  comments: Observable<Comment[]> | undefined
  constructor(private commentService: CommentService) {
    // this.comments = myData.comments
    // console.log(this.comments)
  }

  ngOnInit(): void {
    this.comments = this.commentService.getParentComments()
  }
}
