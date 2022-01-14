import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {CommentService} from './services/comment.service'
import {Comment} from './models/comment.model'
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'interactive-comments-section-main'
  comments: Comment[] = []

  @ViewChild('modalContainer')
  modalContainer: ElementRef = new ElementRef(null)

  replyDeleted = new BehaviorSubject<boolean>(false)
  loading = true;

  constructor(private commentService: CommentService) {
  }

  ngOnInit(): void {
    this.commentService.getParentComments().subscribe(
      comments => {
        this.comments = comments
        this.loading = false
      },
      () => {
        const localComments = this.commentService.getCommentsFromLocalStorage()
        this.comments = localComments.filter(c => c.parentID === -1)
        this.loading = false
      })
    this.commentService.deleted.subscribe(info => {
      if (info.isReply === false)
        this.comments.splice(this.comments.findIndex((c) => c.id === info.id), 1)
        this.commentService.deleteFromLocalComments(info.id)
      }
    )
  }

  onAddComment(comment: Comment): void {
    this.comments.push(comment)
  }

  trackById(index: number, comment: Comment): number {
    return comment.id;
  }

}
