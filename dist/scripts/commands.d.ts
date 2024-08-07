export declare const commands: {
    [key: string]: CommandEnvVariableType[];
};
type CommandEnvVariableType = {
    environmentVariables: string[];
    description: string;
    optional: boolean;
};
export declare function validateCommand(name: string): boolean;
export {};
