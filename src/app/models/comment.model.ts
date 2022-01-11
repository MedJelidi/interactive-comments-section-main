import {Commenter} from "./commenter.model";

export interface Comment {
  id: number
  content: string
  createdAt: string
  parent_id: number
  score: number
  commenter: Commenter
}
