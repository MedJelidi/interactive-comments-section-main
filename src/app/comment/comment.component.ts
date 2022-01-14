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
import {AddCommentComponent} from '../add-comment/add-comment.component'
import {Comment} from '../models/comment.model'
import {Commenter} from '../models/commenter.model'
import {CommentService} from '../services/comment.service'
import {UserService} from '../services/user.service'
import {BehaviorSubject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() id: number = -1
  @Input() content: string | undefined
  @Input() createdAt: string | undefined
  @Input() score: number | undefined
  @Input() commenter: Commenter | undefined
  @Input() modalContainer: any | undefined
  @Input() replyDeleted = new BehaviorSubject<boolean>(false)
  @Input() isReply: boolean = false
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter()

  imageSrc: string = ''
  replies: Comment[] = []
  isCurrentUser: boolean = false
  editMode: boolean = false
  addComponentExists: boolean = false
  editForm: FormGroup

  @ViewChild('addContainer', {read: ViewContainerRef}) target:
    | ViewContainerRef
    | undefined
  private componentRef: ComponentRef<any> | undefined

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private commentService: CommentService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      content: [this.content, Validators.required]
    })
  }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      content: [this.content, Validators.required]
    })
    this.imageSrc = `../../assets${this.commenter?.image.png.slice(1)}`
    this.commentService
      .getRepliesOfComment(this.id ?? 0)
      .subscribe(
        replies => this.replies = replies,
        () => {
          const localComments = this.commentService.getCommentsFromLocalStorage()
          this.replies = localComments.filter(c => c.parentID === this.id && c.parentID !== -1)
        }
      )
    this.isCurrentUser =
      this.userService.currentUser.username === this.commenter?.username
    this.commentService.deleted.subscribe(info => {
        if (info.isReply === true) {
          this.replies.splice(this.replies.findIndex((c) => c.id === info.id), 1)
          this.commentService.deleteFromLocalComments(info.id)
        }
      }
    )
  }

  onClickReply(): void {
    if (!this.addComponentExists) {
      this.createAddComponent()
    } else {
      this.componentRef?.destroy()
    }
    this.addComponentExists = !this.addComponentExists
  }

  onDeleteComment(id: number, isReply: boolean): void {
    // this.deleteEvent.emit({id, isReply: false})
    this.commentService.onDelete(this.modalContainer, id, isReply)
  }

  onClickEdit(): void {
    this.editMode = !this.editMode
  }

  createAddComponent(): void {
    let addCommentComponent = this.componentFactoryResolver.resolveComponentFactory(
      AddCommentComponent,
    )
    this.componentRef = this.target?.createComponent(addCommentComponent)
    this.componentRef!.instance.isReply = true
    this.componentRef!.instance.parentID = this.id
    this.componentRef!.instance.addedComment.subscribe((reply: Comment) => {
      this.replies.push(reply)
      this.onClickReply()
    })
  }

  onUpdate(): void {
    const newContent = this.editForm.value.content
    this.commentService.updateComment(this.id, newContent).subscribe(
      res => {
        this.content = res.content
        this.editMode = false
      },
      () => {
        this.commentService.updateLocalComment(this.id, newContent)
        this.content = newContent
        this.editMode = false
      })
  }
}
