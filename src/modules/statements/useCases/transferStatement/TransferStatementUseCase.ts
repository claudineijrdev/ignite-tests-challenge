import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITrasnferStatementDTO } from "./ITransferStatementDTO";


@injectable()
export class TransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementRepository')
    private statementsRepository: IStatementsRepository,
  ) { }

  async execute({ user_id, amount, description, type, recipient_id }: ITrasnferStatementDTO) {
    if (!recipient_id) {
      throw new Error('Recipient not found.');
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });
    if (balance < amount) {
      throw new Error('Balance is not enougth');
    }

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.WITHDRAW,
      user_id,
    })

    const statement = await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.DEPOSIT,
      user_id: recipient_id
    })
    return statement;
  }
}
