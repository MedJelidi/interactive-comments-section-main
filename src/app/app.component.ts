import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {Observable} from 'rxjs'
import {CommentService} from './services/comment.service'
import {Comment} from './models/comment.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'interactive-comments-section-main'
  comments: Observable<Comment[]> | undefined

  @ViewChild('modalContainer')
  modalContainer: ElementRef | undefined

  constructor(private commentService: CommentService) {
    // this.comments = myData.comments
    // console.log(this.comments)
  }

  ngOnInit(): void {
    this.comments = this.commentService.getParentComments()
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
}
