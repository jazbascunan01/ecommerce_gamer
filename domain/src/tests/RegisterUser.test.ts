import { RegisterUser } from "../use-cases/RegisterUser";
import { AuthService } from "../services/AuthService";
import { UserAlreadyExistsError } from "../errors/DomainError";
import { User } from "../entities/User";
import { UniqueEntityID } from "../core/UniqueEntityID";

// --- Mocking Dependencies ---
// Creamos objetos falsos que simulan nuestras dependencias de persistencia.
const mockUserFinder = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
};

const mockUnitOfWork = {
    users: {
        save: jest.fn(),
    },
    // No necesitamos los otros repositorios para este test, pero los definimos para que el mock sea completo
    products: { 
        save: jest.fn(),
        update: jest.fn(),
    },
    carts: { save: jest.fn() },
    commit: jest.fn().mockResolvedValue(undefined), // Simulamos que el commit siempre funciona
};

const mockUowFactory = {
    create: () => mockUnitOfWork,
};

// Podemos usar el AuthService real ya que no tiene dependencias externas complejas.
const authService = new AuthService();

// Limpiamos los mocks antes de cada test para asegurar que las pruebas no se afecten entre sí.
beforeEach(() => {
    jest.clearAllMocks();
});

describe("RegisterUser Use Case", () => {
    it("should create a new user, hash the password, and save it", async () => {
        // Arrange: Preparamos el escenario.
        // Simulamos que el buscador no encuentra un usuario con ese email.
        mockUserFinder.findByEmail.mockResolvedValue(null);

        // Instanciamos el caso de uso con nuestras dependencias falsas (mocks).
        const registerUser = new RegisterUser(mockUserFinder, mockUowFactory, authService);

        // Act: Ejecutamos la acción que queremos probar.
        const user = await registerUser.execute("Karen", "karen@example.com", "password123");

        // Assert: Verificamos que todo ocurrió como esperábamos.
        expect(user.id).toBeDefined();
        expect(user.passwordHash).not.toBe("password123");
        expect(user.role).toBe("CUSTOMER");

        // Verificamos que se llamó a los métodos de guardado.
        expect(mockUnitOfWork.users.save).toHaveBeenCalledTimes(1);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });

    it("should throw UserAlreadyExistsError if email is already in use", async () => {
        // Arrange: Simulamos que el buscador SÍ encuentra un usuario.
        const existingUser = User.create({
            name: "Otro Nombre",
            email: "karen@example.com",
            passwordHash: "hash",
            role: "CUSTOMER",
            createdAt: new Date()
        }, new UniqueEntityID("id-existente"));
        mockUserFinder.findByEmail.mockResolvedValue(existingUser);

        const registerUser = new RegisterUser(mockUserFinder, mockUowFactory, authService);

        // Act & Assert: Esperamos que la ejecución lance el error específico.
        try {
            await registerUser.execute("Karen", "karen@example.com", "password123");
            fail("Expected RegisterUser.execute to throw an error, but it did not.");
        } catch (error) {
            expect(error).toBeInstanceOf(UserAlreadyExistsError);
        }

        // Verificamos que, al haber un error, no se intentó guardar nada.
        expect(mockUnitOfWork.commit).not.toHaveBeenCalled();
    });
});
