import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUserRepository);
  })

  it("Should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'Teste',
      password: '1234',
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 1366,
      description: 'Deposito',
      type: OperationType.DEPOSIT
    })

    const balance = await getBalanceUseCase.execute({ user_id: user.id as string });

    expect(balance).toHaveProperty("balance");

  })

  it("Should not be able to get balance for a nonexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'ad2asd16a' });
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
