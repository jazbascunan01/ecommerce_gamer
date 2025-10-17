export const mockCartFinder = {
    findByUserId: jest.fn(),
    findOrCreateByUserId: jest.fn(),
};

export const mockProductFinder = {
    findProductById: jest.fn(),
    findAllProducts: jest.fn(),
};

export const mockUnitOfWork = {
    products: { save: jest.fn(), update: jest.fn(), delete: jest.fn() },
    users: { save: jest.fn() },
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
    mockProductFinder.findProductById.mockClear();
    mockProductFinder.findAllProducts.mockClear();
    mockUnitOfWork.products.save.mockClear();
    mockUnitOfWork.products.update.mockClear();
    mockUnitOfWork.products.delete.mockClear();
    mockUnitOfWork.users.save.mockClear();
    mockUnitOfWork.carts.save.mockClear();
    mockUnitOfWork.commit.mockClear();
};