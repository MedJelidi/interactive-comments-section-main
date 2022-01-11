import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { Observable } from 'rxjs'
import { AddCommentComponent } from '../add-comment/add-comment.component'
import { Comment } from '../models/comment.model'
import { Commenter } from '../models/commenter.model'
import { CommentService } from '../services/comment.service'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() id: number | undefined
  @Input() content: string | undefined
  @Input() createdAt: string | undefined
  @Input() score: number | undefined
  @Input() commenter: Commenter | undefined

  @Output() deleteEvent: EventEmitter<any> = new EventEmitter()

  imageSrc: string = ''
  replies: Observable<Comment[]> | undefined
  isCurrentUser: boolean | undefined
  editMode: boolean

  addComponentExists: boolean
  @ViewChild('addContainer', { read: ViewContainerRef }) target:
    | ViewContainerRef
    | undefined
  @ViewChild('modalContainer') modalContainer: Element | undefined
  private componentRef: ComponentRef<any> | undefined

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private commentService: CommentService,
    private userService: UserService,
  ) {
    this.addComponentExists = false
    this.editMode = false
  }

  ngOnInit(): void {
    this.imageSrc = `../../assets${this.commenter?.image.png.slice(1)}`
    this.replies = this.commentService.getRepliesOfComment(this.id ?? 0)
    this.isCurrentUser =
      this.userService.currentUser.username === this.commenter?.username
  }

  onReply(): void {
    if (!this.addComponentExists) {
      this.createAddComponent()
    } else {
      this.componentRef?.destroy()
    }
    this.addComponentExists = !this.addComponentExists
  }

  onDelete(id: number): void {
    this.deleteEvent.emit(id)
  }

  onEdit(): void {
    this.editMode = !this.editMode
  }

  createAddComponent(): void {
    let addCommentComponent = this.componentFactoryResolver.resolveComponentFactory(
      AddCommentComponent,
    )
    this.componentRef = this.target?.createComponent(addCommentComponent)
    this.componentRef!.instance.isReply = true
  }
}
