export type ClassType<Interface> = new (...args: any[]) => Interface;
export type AnyClass = ClassType<any>;
