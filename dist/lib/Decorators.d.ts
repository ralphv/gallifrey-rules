export declare function DontThrowJustLog(originalMethod: any, context: ClassMethodDecoratorContext): (this: any, ...args: any[]) => any;
export declare function TimeAndWarn(thresholdMS?: number): (originalMethod: any, context: ClassMethodDecoratorContext) => (this: any, ...args: any[]) => any;
export declare function BeforeExit(originalMethod: any, context: ClassMethodDecoratorContext): void;
export declare function TimeIt(originalMethod: any, context: ClassMethodDecoratorContext): (this: any, ...args: any[]) => any;
