import { HttpErrorResponse } from '@angular/common/http'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'

import { Comment } from '../models/comment.model'
import { CommentService } from './comment.service'

const baseUrl = 'https://localhost:8000/'
const parentUrl = baseUrl + 'parent_comments'
const repliesUrl = baseUrl + 'replies/0'
const addCommentUrl = baseUrl + 'comment'
const deleteCommentUrl = baseUrl + 'delete_comment/0'
const updateCommentUrl = baseUrl + 'update_comment/0'
const fakeData: Comment[] = [
  {
    "id": 1,
    "content": "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    "createdAt": "2022-01-09 13:59:47",
    "parentID": -1,
    "score": 12,
    "commenter": {
      "id": 2,
      "username": "amyrobson",
      "image": {
        "id": 2,
        "png": "./images/avatars/image-amyrobson.png",
        "webp": "./images/avatars/image-amyrobson.webp"
      }
    }
  },
  {
    "id": 2,
    "content": "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
    "createdAt": "2022-01-09 14:04:00",
    "parentID": -1,
    "score": 5,
    "commenter": {
      "id": 3,
      "username": "maxblagun",
      "image": {
        "id": 3,
        "png": "./images/avatars/image-maxblagun.png",
        "webp": "./images/avatars/image-maxblagun.webp"
      }
    }
  },
]

describe('CommentService', () => {
  let commentService: CommentService
  let controller: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });
    commentService = TestBed.inject(CommentService)
    controller = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    controller.verify()
  });

  it('gets all parent comments', () => {
    let parentComments: Comment[] | undefined
    commentService.getParentComments().subscribe((comments) => {
      parentComments = comments
    });

    controller.expectOne(parentUrl).flush(fakeData)
    expect(parentComments).toEqual(fakeData)
  });

  it('gets all replies of a parent comment', () => {
    let replies: Comment[] | undefined
    commentService.getRepliesOfComment(0).subscribe((r) => {
      replies = r
    });

    controller.expectOne(repliesUrl).flush(fakeData)
    expect(replies).toEqual(fakeData)
  });

    it('adds a comment', () => {
    let fakeComment: Comment | undefined
    commentService.addComment(fakeData[0]).subscribe((c) => {
      fakeComment = c
    });

    controller.expectOne(addCommentUrl).flush(fakeData[0])
    expect(fakeComment).toEqual(fakeData[0])
  });

  it('deletes a comment', () => {
    let fakeComment: Comment | undefined
    commentService.deleteComment(0).subscribe((c) => {
      fakeComment = c
    });

    controller.expectOne(deleteCommentUrl).flush(fakeData[0])
    expect(fakeComment).toEqual(fakeData[0])
  });

  it('updates a comment', () => {
    let fakeComment: Comment | undefined
    commentService.updateComment(0, 'test').subscribe((c) => {
      fakeComment = c
    });

    controller.expectOne(updateCommentUrl).flush(fakeData[0])
    expect(fakeComment).toEqual(fakeData[0])
  });

});
