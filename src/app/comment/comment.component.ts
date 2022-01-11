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
import { AddCommentComponent } from '../add-comment/add-comment.component'
import { Comment } from '../models/comment.model'
import { Commenter } from '../models/commenter.model'
import { CommentService } from '../services/comment.service'
import { UserService } from '../services/user.service'
import {BehaviorSubject} from "rxjs";

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
  @Input() replyDeleted = new BehaviorSubject<boolean>(false)

  @Output() deleteEvent: EventEmitter<any> = new EventEmitter()

  imageSrc: string = ''
  replies: Comment[] = []
  isCurrentUser: boolean | undefined
  editMode: boolean = false
  addComponentExists: boolean = false

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
  }

  ngOnInit(): void {
    this.imageSrc = `../../assets${this.commenter?.image.png.slice(1)}`
    this.commentService.getRepliesOfComment(this.id ?? 0).subscribe(replies => this.replies = replies)
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

  onDeleteComment(id: number): void {
    this.deleteEvent.emit({id, isReply: false})
  }

  onDeleteReply($event: any): void {
    this.deleteEvent.emit({id: $event.id, isReply: true})
    this.replyDeleted.subscribe((deleted) => {
      if (deleted) this.replies.splice(this.replies.findIndex((r) => r.id === $event.id), 1)
    })
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
    this.componentRef!.instance.parentID = this.id
    this.componentRef!.instance.addedComment.subscribe((reply: Comment) =>{
      console.log(reply)
      this.replies.push(reply)
    })
  }
}
