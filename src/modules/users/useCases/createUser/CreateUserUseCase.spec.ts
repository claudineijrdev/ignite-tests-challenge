import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  })

  it("Should be able to create an user", async () => {
    const user = await createUserUseCase.execute({
      email: "user@email.com",
      password: "1234",
      name: "user",
    });

    expect(user).toHaveProperty("id");
  })

  it("Should not be able to create an user if it already exists", async () => {
    expect(async()=>{
      await createUserUseCase.execute({
        email: "user@email.com",
        password: "1234",
        name: "user",
      });

      await createUserUseCase.execute({
        email: "user@email.com",
        password: "657",
        name: "secondUser",
      });

    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
