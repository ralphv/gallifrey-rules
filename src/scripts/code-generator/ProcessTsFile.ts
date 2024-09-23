import ts from 'typescript';
import fs from 'fs';
import path from 'path';

interface ProcessTsFileAddImportDelegate {
    (importStatement: string, importFilename: string): void;
}

interface ProcessTsFileProcessInterfaceDelegate {
    (filename: string, className: string, genericTypes: string[], interfaceName: string): void;
}

export class ProcessTsFile {
    constructor(
        private addImport: ProcessTsFileAddImportDelegate,
        private processInterfaceFile: ProcessTsFileProcessInterfaceDelegate,
    ) {}

    public processFileForClassWithInterface(filePath: string, interfaces: string[]) {
        const sourceFile = ts.createSourceFile(
            filePath,
            fs.readFileSync(filePath).toString(),
            ts.ScriptTarget.Latest,
            true,
        );

        const definedTypes: Set<string> = this.discoverTypes(sourceFile);

        const visit = (node: ts.Node) => {
            if (ts.isClassDeclaration(node) && node.name) {
                const heritageClauses = node.heritageClauses;

                interfaces.forEach((interfaceName) => {
                    const hasPluginInterface = heritageClauses?.some((clause) =>
                        clause.types.some((type) => type.expression.getText() === interfaceName),
                    );

                    if (hasPluginInterface && heritageClauses) {
                        const genericTypes = heritageClauses
                            ?.flatMap((clause) =>
                                clause.types.filter((type) => type.expression.getText() === interfaceName),
                            )
                            .map((type) => {
                                if (type.typeArguments) {
                                    return type.typeArguments.map((arg) => arg.getText());
                                }
                                return [];
                            })
                            .flat();

                        const externalImports = genericTypes.filter(
                            (type) => definedTypes.has(type) && !basicTypes.has(type), // Only add if not defined in the file and not a basic type
                        );
                        externalImports.forEach((type: string) => {
                            this.addImport(`{ ${type} }`, filePath);
                        });
                        // @ts-expect-error not undefined
                        this.addImport(`${node.name.text}`, filePath);
                        // @ts-expect-error not undefined
                        this.processInterfaceFile(path.basename(filePath), node.name.text, genericTypes, interfaceName);
                    }
                });
            }

            ts.forEachChild(node, visit); // Visit children of the node
        };
        ts.forEachChild(sourceFile, visit); // Start visiting from the root node
    }

    private discoverTypes(sourceFile: ts.SourceFile) {
        const definedTypes: Set<string> = new Set<string>();
        ts.forEachChild(sourceFile, (node) => this.visitDiscoverTypes(node, definedTypes));
        return definedTypes;
    }

    private visitDiscoverTypes = (node: ts.Node, definedTypes: Set<string>) => {
        if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isClassDeclaration(node)) {
            if (node.name) {
                definedTypes.add(node.name.text);
            }
        }
        ts.forEachChild(node, (node) => this.visitDiscoverTypes(node, definedTypes));
    };
}

const basicTypes = new Set([
    'string',
    'number',
    'boolean',
    'void',
    'null',
    'undefined',
    'any',
    'unknown',
    'never',
    'symbol',
    'bigint',
    'any[]',
]);
