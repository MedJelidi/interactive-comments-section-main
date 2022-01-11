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

  constructor(private commentService: CommentService) {
  }

  ngOnInit(): void {
     this.commentService.getParentComments().subscribe(comments => this.comments = comments)
  }

  onDelete($event: any): void {
    const modal = this.modalContainer.nativeElement
    modal.classList.add('shown')
    // don't exit it if clicked on container, but exit if clicked outside
    let inCont = false
    let clickedButton = false
    const modalContainer = document.querySelector('.modal-container')
    modal.addEventListener('click', () => {
      if (!inCont) modal.classList.remove('shown')
      inCont = false
    })
    modalContainer?.addEventListener('click', () => {
      if (!clickedButton) {
        inCont = true
        modal.classList.add('shown')
      }
    })
    const confirmButton = modalContainer?.querySelector('.confirm')
    const cancelButton = modalContainer?.querySelector('.cancel')
    const confirmDeletion = () => {
      console.log('eeee')
      clickedButton = true
      confirmButton?.removeEventListener('click', confirmDeletion)
      if (!$event.isReply) {
        this.commentService.deleteComment($event.id).subscribe(() => {
          this.comments.splice(this.comments.findIndex((c) => c.id === $event.id), 1)
        })
      } else {
        this.commentService.deleteComment($event.id).subscribe(() => {
          this.replyDeleted.next(true)
        })
      }
    }
    const cancelDeletion = () => {
      clickedButton = true
      cancelButton?.removeEventListener('click', cancelDeletion)
    }
    confirmButton?.addEventListener('click', confirmDeletion)
    cancelButton?.addEventListener('click', cancelDeletion)
  }

  onAddComment(comment: Comment): void {
    this.comments.push(comment)
  }

  trackById(index: number, comment: Comment): number {
    return comment.id;
  }
}
