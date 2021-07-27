import { Statement } from "../../entities/Statement";

export type ITrasnferStatementDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'amount' |
  'type' |
  'recipient_id'
  >
