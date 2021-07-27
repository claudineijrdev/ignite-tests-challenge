import { Request, Response } from "express";
import { container } from 'tsyringe';
import { TransferStatementUseCase } from "./TransferStatementUseCase";

enum OperationType {
  TRANSFERS = 'trasnfers',
}

export class TransferStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id: recipient_id } = request.params;
    const { amount, description } = request.body;

    const transferStatement = container.resolve(TransferStatementUseCase);

    const statement = await transferStatement.execute({
      user_id: sender_id,
      type: OperationType.TRANSFERS,
      amount,
      description,
      recipient_id,
    })
    return response.status(201).json(statement);
  }
}
