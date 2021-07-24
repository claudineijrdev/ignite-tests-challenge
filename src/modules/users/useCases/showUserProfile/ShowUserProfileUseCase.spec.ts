import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  })

  it("Should be able to return an user profile by user_id", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@teste.com.br",
      password: "1234",
      name: "Teste",
    })
    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response).toHaveProperty("id");
  })

  it("Should not be able to return an nonexists user profile", () => {
    expect(async () => {
      await showUserProfileUseCase.execute('2asd13as1d56ad46');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })

})
