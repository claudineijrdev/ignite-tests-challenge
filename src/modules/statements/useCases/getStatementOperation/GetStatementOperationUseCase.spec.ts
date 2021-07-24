import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUserRepository, inMemoryStatementRepository);
  })

  it("Should be able to get statement Operation", async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Teste',
      password: '1234',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 1366,
      description: 'Deposito',
      type: OperationType.DEPOSIT
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(statementOperation).toHaveProperty("id");

  })

  it("Should not be able to get a nonexistent statement", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: 'teste@teste.com',
        name: 'Teste',
        password: '1234',
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: '216546546'
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })

  it("Should not be able to get statement for a nonexistent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: 'ad2asd16a', statement_id: '216546546' });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })
})
