export const mockCartFinder = {
    findByUserId: jest.fn(),
    findOrCreateByUserId: jest.fn(),
};

export const mockUserFinder = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
};

export const mockProductFinder = {
    findProductById: jest.fn(),
    findAllProducts: jest.fn(),
};

export const mockUnitOfWork = {
    products: { save: jest.fn(), update: jest.fn(), delete: jest.fn() },
    // Hacemos que el mock de 'save' devuelva el usuario que recibe, simulando un guardado exitoso.
    users: {
        save: jest.fn().mockImplementation(user => Promise.resolve(user)),
    },
    carts: { save: jest.fn() },
    commit: jest.fn().mockResolvedValue(undefined),
};

export const mockUowFactory = {
    create: () => mockUnitOfWork,
};

// Una función para resetear todos los mocks antes de cada test
export const resetMocks = () => {
    mockCartFinder.findByUserId.mockClear();
    mockCartFinder.findOrCreateByUserId.mockClear();
    mockUserFinder.findByEmail.mockClear();
    mockUserFinder.findById.mockClear();
    mockProductFinder.findProductById.mockClear();
    mockProductFinder.findAllProducts.mockClear();
    mockUnitOfWork.products.save.mockClear();
    mockUnitOfWork.products.update.mockClear();
    mockUnitOfWork.products.delete.mockClear();
    mockUnitOfWork.users.save.mockClear();
    mockUnitOfWork.carts.save.mockClear();
    mockUnitOfWork.commit.mockClear();
};