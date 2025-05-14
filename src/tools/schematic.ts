/**
 * Schematic generation tools for KiCAD MCP server
 *
 * Provides tools for creating, modifying, and exporting schematics
 * using the kicad-skip library
 */

import { spawn } from 'child_process';
import { logger } from '../logger.js';

/**
 * Register all schematic-related tools with the provided MCP tool handler
 *
 * @param addTool Function to register tools with the MCP server
 * @param pythonPath Path to Python interpreter
 * @param scriptBasePath Base path for Python scripts
 */
export const registerSchematicTools = (addTool: Function, pythonPath: string, scriptBasePath: string) => {
    // Create a schematic project
    addTool({
        name: 'create_schematic',
        description: 'Create a new KiCAD schematic',
        inputSchema: {
            type: 'object',
            properties: {
                projectName: {
                    type: 'string',
                    description: 'Name of the schematic project'
                },
                path: {
                    type: 'string',
                    description: 'Path where to create the schematic file'
                },
                metadata: {
                    type: 'object',
                    description: 'Optional metadata for the schematic'
                }
            },
            required: ['projectName']
        },
        handler: async ({ projectName, path, metadata }: { projectName: string, path: string, metadata: any }) => {
            logger.info(`Creating schematic project: ${projectName}`);
            // Build the Python script command
            const command = [
                '-c',
                `import json; import sys; sys.path.append('${scriptBasePath}'); ` +
                    `from commands.schematic import SchematicManager; ` +
                    `schematic = SchematicManager.create_schematic('${projectName}', ${metadata ? JSON.stringify(metadata) : 'None'}); ` +
                    `file_path = '${path || '.'}/${projectName}.kicad_sch'; ` +
                    `success = SchematicManager.save_schematic(schematic, file_path); ` +
                    `print(json.dumps({'success': success, 'file_path': file_path}));`
            ];
            return new Promise((resolve, reject) => {
                let output = '';
                const process = spawn(pythonPath, command);
                process.stdout.on('data', (data) => {
                    output += data.toString();
                });
                process.stderr.on('data', (data) => {
                    logger.error(`Schematic creation error: ${data}`);
                });
                process.on('close', (code) => {
                    if (code !== 0) {
                        reject(`Failed to create schematic: exit code ${code}`);
                        return;
                    }
                    try {
                        // Extract the JSON result from the output
                        const result = JSON.parse(output.substring(output.lastIndexOf('{')));
                        resolve(result);
                    }
                    catch (e) {
                        logger.error(`Error parsing schematic creation result: ${e}`);
                        reject(`Failed to parse schematic creation result: ${e}`);
                    }
                });
            });
        }
    });
    // Load a schematic
    addTool({
        name: 'load_schematic',
        description: 'Load an existing KiCAD schematic',
        inputSchema: {
            type: 'object',
            properties: {
                filename: {
                    type: 'string',
                    description: 'Path to the schematic file to load'
                }
            },
            required: ['filename']
        },
        handler: async ({ filename }: { filename: string }) => {
            logger.info(`Loading schematic: ${filename}`);
            const command = [
                '-c',
                `import json; import sys; sys.path.append('${scriptBasePath}'); ` +
                    `from commands.schematic import SchematicManager; ` +
                    `schematic = SchematicManager.load_schematic('${filename}'); ` +
                    `success = schematic is not None; ` +
                    `metadata = SchematicManager.get_schematic_metadata(schematic) if success else {}; ` +
                    `print(json.dumps({'success': success, 'metadata': metadata}));`
            ];
            return new Promise((resolve, reject) => {
                let output = '';
                const process = spawn(pythonPath, command);
                process.stdout.on('data', (data) => {
                    output += data.toString();
                });
                process.stderr.on('data', (data) => {
                    logger.error(`Schematic loading error: ${data}`);
                });
                process.on('close', (code) => {
                    if (code !== 0) {
                        reject(`Failed to load schematic: exit code ${code}`);
                        return;
                    }
                    try {
                        // Extract the JSON result from the output
                        const result = JSON.parse(output.substring(output.lastIndexOf('{')));
                        resolve(result);
                    }
                    catch (e) {
                        logger.error(`Error parsing schematic loading result: ${e}`);
                        reject(`Failed to parse schematic loading result: ${e}`);
                    }
                });
            });
        }
    });
    // Add a component to a schematic
    addTool({
        name: 'add_schematic_component',
        description: 'Add a component to a KiCAD schematic',
        inputSchema: {
            type: 'object',
            properties: {
                schematicPath: {
                    type: 'string',
                    description: 'Path to the schematic file'
                },
                component: {
                    type: 'object',
                    description: 'Component definition',
                    properties: {
                        type: { type: 'string', description: 'Component type (e.g., R, C, LED)' },
                        reference: { type: 'string', description: 'Reference designator (e.g., R1, C2)' },
                        value: { type: 'string', description: 'Component value (e.g., 10k, 0.1uF)' },
                        library: { type: 'string', description: 'Symbol library name' },
                        x: { type: 'number', description: 'X position in schematic' },
                        y: { type: 'number', description: 'Y position in schematic' },
                        rotation: { type: 'number', description: 'Rotation angle in degrees' },
                        properties: { type: 'object', description: 'Additional properties' }
                    },
                    required: ['type', 'reference']
                }
            },
            required: ['schematicPath', 'component']
        },
        handler: async ({ schematicPath, component }: { schematicPath: string, component: any }) => {
            logger.info(`Adding component ${component.reference} to schematic: ${schematicPath}`);
            const command = [
                '-c',
                `import json; import sys; sys.path.append('${scriptBasePath}'); ` +
                    `from commands.schematic import SchematicManager; ` +
                    `from commands.component_schematic import ComponentManager; ` +
                    `schematic = SchematicManager.load_schematic('${schematicPath}'); ` +
                    `success = False; ` +
                    `if schematic: ` +
                    `    component = ComponentManager.add_component(schematic, ${JSON.stringify(component)}); ` +
                    `    success = component is not None; ` +
                    `    if success: ` +
                    `        SchematicManager.save_schematic(schematic, '${schematicPath}'); ` +
                    `print(json.dumps({'success': success}));`
            ];
            return new Promise((resolve, reject) => {
                let output = '';
                const process = spawn(pythonPath, command);
                process.stdout.on('data', (data) => {
                    output += data.toString();
                });
                process.stderr.on('data', (data) => {
                    logger.error(`Add component error: ${data}`);
                });
                process.on('close', (code) => {
                    if (code !== 0) {
                        reject(`Failed to add component: exit code ${code}`);
                        return;
                    }
                    try {
                        // Extract the JSON result from the output
                        const result = JSON.parse(output.substring(output.lastIndexOf('{')));
                        resolve(result);
                    }
                    catch (e) {
                        logger.error(`Error parsing add component result: ${e}`);
                        reject(`Failed to parse add component result: ${e}`);
                    }
                });
            });
        }
    });
    // Add a wire to a schematic
    addTool({
        name: 'add_schematic_wire',
        description: 'Add a wire connection to a KiCAD schematic',
        inputSchema: {
            type: 'object',
            properties: {
                schematicPath: {
                    type: 'string',
                    description: 'Path to the schematic file'
                },
                startPoint: {
                    type: 'array',
                    description: 'Starting point coordinates [x, y]',
                    items: { type: 'number' },
                    minItems: 2,
                    maxItems: 2
                },
                endPoint: {
                    type: 'array',
                    description: 'Ending point coordinates [x, y]',
                    items: { type: 'number' },
                    minItems: 2,
                    maxItems: 2
                }
            },
            required: ['schematicPath', 'startPoint', 'endPoint']
        },
        handler: async ({ schematicPath, startPoint, endPoint }: { schematicPath: string, startPoint: number[], endPoint: number[] }) => {
            logger.info(`Adding wire from ${startPoint} to ${endPoint} in schematic: ${schematicPath}`);
            const command = [
                '-c',
                `import json; import sys; sys.path.append('${scriptBasePath}'); ` +
                    `from commands.schematic import SchematicManager; ` +
                    `from commands.connection_schematic import ConnectionManager; ` +
                    `schematic = SchematicManager.load_schematic('${schematicPath}'); ` +
                    `success = False; ` +
                    `if schematic: ` +
                    `    wire = ConnectionManager.add_wire(schematic, ${JSON.stringify(startPoint)}, ${JSON.stringify(endPoint)}); ` +
                    `    success = wire is not None; ` +
                    `    if success: ` +
                    `        SchematicManager.save_schematic(schematic, '${schematicPath}'); ` +
                    `print(json.dumps({'success': success}));`
            ];
            return new Promise((resolve, reject) => {
                let output = '';
                const process = spawn(pythonPath, command);
                process.stdout.on('data', (data) => {
                    output += data.toString();
                });
                process.stderr.on('data', (data) => {
                    logger.error(`Add wire error: ${data}`);
                });
                process.on('close', (code) => {
                    if (code !== 0) {
                        reject(`Failed to add wire: exit code ${code}`);
                        return;
                    }
                    try {
                        // Extract the JSON result from the output
                        const result = JSON.parse(output.substring(output.lastIndexOf('{')));
                        resolve(result);
                    }
                    catch (e) {
                        logger.error(`Error parsing add wire result: ${e}`);
                        reject(`Failed to parse add wire result: ${e}`);
                    }
                });
            });
        }
    });
    // Find available symbol libraries
    addTool({
        name: 'list_schematic_libraries',
        description: 'List available KiCAD symbol libraries',
        inputSchema: {
            type: 'object',
            properties: {
                searchPaths: {
                    type: 'array',
                    description: 'Optional search paths for libraries',
                    items: { type: 'string' }
                }
            }
        },
        handler: async ({ searchPaths }: { searchPaths: string[] }) => {
            logger.info('Listing available schematic libraries');
            const command = [
                '-c',
                `import json; import sys; sys.path.append('${scriptBasePath}'); ` +
                    `from commands.library_schematic import LibraryManager; ` +
                    `search_paths = ${searchPaths ? JSON.stringify(searchPaths) : 'None'}; ` +
                    `libraries = LibraryManager.list_available_libraries(search_paths); ` +
                    `print(json.dumps(libraries));`
            ];
            return new Promise((resolve, reject) => {
                let output = '';
                const process = spawn(pythonPath, command);
                process.stdout.on('data', (data) => {
                    output += data.toString();
                });
                process.stderr.on('data', (data) => {
                    logger.error(`List libraries error: ${data}`);
                });
                process.on('close', (code) => {
                    if (code !== 0) {
                        reject(`Failed to list libraries: exit code ${code}`);
                        return;
                    }
                    try {
                        // Extract the JSON result from the output
                        const result = JSON.parse(output.substring(output.lastIndexOf('{')));
                        resolve(result);
                    }
                    catch (e) {
                        logger.error(`Error parsing list libraries result: ${e}`);
                        reject(`Failed to parse list libraries result: ${e}`);
                    }
                });
            });
        }
    });
    // Export schematic to PDF
    addTool({
        name: 'export_schematic_pdf',
        description: 'Export a KiCAD schematic to PDF',
        inputSchema: {
            type: 'object',
            properties: {
                schematicPath: {
                    type: 'string',
                    description: 'Path to the schematic file'
                },
                outputPath: {
                    type: 'string',
                    description: 'Path for the output PDF file'
                }
            },
            required: ['schematicPath', 'outputPath']
        },
        handler: async ({ schematicPath, outputPath }: { schematicPath: string, outputPath: string }) => {
            logger.info(`Exporting schematic to PDF: ${schematicPath} -> ${outputPath}`);
            // This requires KiCAD CLI to be installed and accessible
            // We'll use the Python script to handle this since it can wrap the KiCAD CLI call
            const command = [
                '-c',
                `import json; import sys; import subprocess; import os; sys.path.append('${scriptBasePath}'); ` +
                    `try: ` +
                    `    temp_path = '${schematicPath}'; ` +
                    `    output_path = '${outputPath}'; ` +
                    `    result = subprocess.run(["kicad-cli", "sch", "export", "pdf", "--output", output_path, temp_path], ` +
                    `                          capture_output=True, text=True); ` +
                    `    success = result.returncode == 0; ` +
                    `    message = result.stderr if not success else ""; ` +
                    `    print(json.dumps({'success': success, 'message': message})); ` +
                    `except Exception as e: ` +
                    `    print(json.dumps({'success': False, 'message': str(e)}));`
            ];
            return new Promise((resolve, reject) => {
                let output = '';
                const process = spawn(pythonPath, command);
                process.stdout.on('data', (data) => {
                    output += data.toString();
                });
                process.stderr.on('data', (data) => {
                    logger.error(`Export PDF error: ${data}`);
                });
                process.on('close', (code) => {
                    if (code !== 0) {
                        reject(`Failed to export PDF: exit code ${code}`);
                        return;
                    }
                    try {
                        // Extract the JSON result from the output
                        const result = JSON.parse(output.substring(output.lastIndexOf('{')));
                        resolve(result);
                    }
                    catch (e) {
                        logger.error(`Error parsing export PDF result: ${e}`);
                        reject(`Failed to parse export PDF result: ${e}`);
                    }
                });
            });
        }
    });
};
