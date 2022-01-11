import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {CommentService} from './services/comment.service'
import {Comment} from './models/comment.model'
import {combineLatestWith} from "rxjs/operators";
import {Cons, Observable, OperatorFunction, Subject} from "rxjs/dist/types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'interactive-comments-section-main'
  comments: OperatorFunction<unknown, Cons<unknown, readonly unknown[]>>

  @ViewChild('modalContainer')
  modalContainer: ElementRef = new ElementRef(null);

  commentObs: Subject<Comment>

  constructor(private commentService: CommentService) {
    this.commentObs = new Subject<Comment>()
    this.comments = combineLatestWith(this.commentService.getParentComments(), this.commentObs)
  }

  ngOnInit(): void {
  }

  onDelete(id: number): void {
    const modal = this.modalContainer?.nativeElement
    modal.classList.add('shown')
    // don't exit it if clicked on container, but exit if clicked outside
    let inCont = false
    const modalContainer = document.querySelector('.modal-container')
    modal.addEventListener('click', () => {
      if (!inCont) modal.classList.remove('shown')
      inCont = false
    })
    modalContainer?.addEventListener('click', () => {
      inCont = true
      modal.classList.add('shown')
    })
  }

  onAddComment(comment: Comment): void {
    this.commentObs.next(comment)
  }
}
