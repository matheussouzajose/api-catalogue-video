export interface IQuery<Input, Output> {
  execute(input: Input): Promise<Output>;
}
