import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  })

  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      email: "teste@teste.com.br",
      password: "1234",
      name: "Teste",
    }

    await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    })

  });

  it("Should not be able to authenticate a nonexistent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "wrongmail@error.com",
        password: "3366",
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate an incorrect password", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "correct_mail@login.com",
        password: "correctpass10",
        name: "Correct Login",
      })

      await authenticateUserUseCase.execute({
        email: "correct_mail@login.com",
        password: "wrongpass10",
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
