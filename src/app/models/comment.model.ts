import {Commenter} from "./commenter.model";

export interface Comment {
  id: number
  content: string
  createdAt: string
  parentID: number
  score: number
  commenter: Commenter
}
