import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import { UserService } from '../services/user.service'
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommentService} from "../services/comment.service";
import {Comment} from "../models/comment.model"

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent implements OnInit {
  imageSrc: string = ''
  @Input() isReply: boolean = false
  @Output() addedComment: EventEmitter<Comment> = new EventEmitter()
  commentForm: FormGroup
  constructor(private userService: UserService, private formBuilder: FormBuilder, private commentService: CommentService) {
    this.commentForm = this.formBuilder.group({
      content: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.imageSrc = `../../assets${this.userService.currentUser.image.png.slice(
      1,
    )}`
  }

  onAdd(): void {
    const content: string = this.commentForm?.value.content
    const comment: Comment = {id: -1, content: content, commenter: this.userService.currentUser, parent_id: -1, score: 0, created_at: ''}
    console.log(comment)
    this.commentService.addComment(comment).subscribe(comment => {
      this.addedComment.emit(comment)
    }, err => console.error(err))
  }
}
