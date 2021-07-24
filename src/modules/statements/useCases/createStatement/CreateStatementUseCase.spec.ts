import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  })

  it("Should be able to create a statement", async () => {
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
    expect(statement).toHaveProperty('id');
  })

  it("Should not be able to create a statement with a nonexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: '21345as65da4',
        amount: 1366,
        description: 'Deposito',
        type: OperationType.DEPOSIT
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })

  it("Should not be able to withdrawn with no founds", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: 'teste@teste.com',
        name: 'Teste',
        password: '1234',
      });
      await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: -666,
        description: 'Saque',
        type: OperationType.WITHDRAW
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
