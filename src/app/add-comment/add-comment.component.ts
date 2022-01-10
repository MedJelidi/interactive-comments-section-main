import { Component, Input, OnInit } from '@angular/core'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent implements OnInit {
  imageSrc: string | undefined
  @Input() isReply: boolean | undefined
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.imageSrc = `../../assets${this.userService.currentUser.image.png.slice(
      1,
    )}`
  }
}
