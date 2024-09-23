import * as fs from 'fs';
import * as path from 'path';
import { EOL } from 'node:os';
import { ProcessTsFile } from './code-generator/ProcessTsFile';

function removeFileExtension(filePath: string): string {
    const baseName = path.basename(filePath); // Get the file name with extension
    const nameWithoutExt = baseName.replace(path.extname(filePath), ''); // Remove the extension
    return path.join(path.dirname(filePath), nameWithoutExt); // Rebuild the path without the extension
}

function removeTopLevelPath(fullPath: string, topLevel: string): string {
    const normalizedFullPath = path.resolve(fullPath);
    const normalizedTopLevel = path.resolve(topLevel);
    if (normalizedFullPath.startsWith(normalizedTopLevel)) {
        return path.relative(normalizedTopLevel, normalizedFullPath);
    }
    return fullPath;
}

// Function to recursively process all TypeScript files in a directory
function processDirectory(
    directory: string,
    interfaces: string[],
    output: {
        actionOutputContents: string[];
        doOutputContents: string[];
        imports: string[];
    },
    srcRoot: string,
): any {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = path.join(directory, dirent.name);

        if (dirent.isDirectory()) {
            processDirectory(fullPath, interfaces, output, srcRoot); // Recurse into subdirectory
        } else if (dirent.isFile() && dirent.name.endsWith('.ts')) {
            const processFile = new ProcessTsFile(
                (importStatement: string, importFilename: string) => {
                    output.imports.push(
                        `import ${importStatement} from './${removeFileExtension(removeTopLevelPath(importFilename, srcRoot))}';`,
                    );
                },
                (filename: string, className: string, genericTypes: string[], interfaceName: string) => {
                    if (interfaceName === 'ActionInterface') {
                        output.actionOutputContents
                            .push(`    ${className}: async (engine: EngineRuleInterface<any>, payload: ${genericTypes[0]}) => {
        return engine.doAction<${genericTypes[0]}, ${genericTypes[1]}>(${className}.name, payload);
    }`);
                    } else {
                        output.doOutputContents
                            .push(`    ${className}: async (engine: EngineRuleInterface<any>, payload: ${genericTypes[0]}) => {
        return engine.pullDataObject<${genericTypes[0]}, ${genericTypes[1]}>(${className}.name, payload);
    }`);
                    }
                },
            );

            processFile.processFileForClassWithInterface(fullPath, interfaces);
        }
    });
}

export function generateCodeForDataObjectsAndActionsHelpers(
    srcRoot: string,
    outputFile: string,
    modulesDirectories: string[],
) {
    const actionOutputContents: string[] = [];
    const doOutputContents: string[] = [];
    const imports: string[] = [];

    for (const moduleDirectory of modulesDirectories) {
        processDirectory(
            moduleDirectory,
            ['ActionInterface', 'DataObjectInterface'],
            { actionOutputContents, doOutputContents, imports },
            srcRoot,
        );
    }

    // Write output to the file
    fs.writeFileSync(
        outputFile,
        `// code generated file, do not edit.
import { EngineRuleInterface } from 'gallifrey-rules';
${imports.join(EOL)}

export const Actions = {
${actionOutputContents.join(`,${EOL}`)}
};

export const DataObjects = {
${doOutputContents.join(`,${EOL}`)}
};
`,
        { encoding: 'utf-8' },
    );
    console.log(`Output written to ${outputFile}`);
}
