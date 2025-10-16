export interface UnitOfWork {
  execute<T>(work: () => Promise<T>): Promise<T>;
}

export interface UnitOfWorkFactory {
  create(): UnitOfWork;
}
