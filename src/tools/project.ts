/**
 * Project management tools for KiCAD MCP server
 *
 * These tools handle KiCAD project operations like creating, opening, and saving projects
 */
import { z } from 'zod';
import { logger } from '../logger.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Command function type for KiCAD script calls
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;

/**
 * Register project management tools with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export function registerProjectTools(server: McpServer, callKicadScript: CommandFunction) {
    logger.info('Registering project management tools');
    // ------------------------------------------------------
    // Create Project Tool
    // ------------------------------------------------------
    server.tool("create_project", {
        projectName: z.string().describe("Name of the project"),
        path: z.string().describe("Directory path where the project should be created"),
        template: z.string().optional().describe("Optional template to use for the new project")
    }, async ({ projectName, path, template }) => {
        logger.debug(`Creating new project: ${projectName} at ${path}`);
        const result = await callKicadScript("create_project", { projectName, path, template });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Open Project Tool
    // ------------------------------------------------------
    server.tool("open_project", {
        filename: z.string().describe("Path to the KiCAD project file (.kicad_pro)")
    }, async ({ filename }: { filename: string }) => {
        logger.debug(`Opening project: ${filename}`);
        const result = await callKicadScript("open_project", { filename });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Save Project Tool
    // ------------------------------------------------------
    server.tool("save_project", {
        filename: z.string().optional().describe("Optional path to save the project to (if different from current)")
    }, async ({ filename }) => {
        logger.debug(`Saving project${filename ? ` to ${filename}` : ''}`);
        const result = await callKicadScript("save_project", { filename });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Get Project Info Tool
    // ------------------------------------------------------
    server.tool("get_project_info", {}, async () => {
        logger.debug('Getting project information');
        const result = await callKicadScript("get_project_info", {});
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Set Project Properties Tool
    // ------------------------------------------------------
    server.tool("set_project_properties", {
        title: z.string().optional().describe("Project title"),
        company: z.string().optional().describe("Company name"),
        revision: z.string().optional().describe("Project revision"),
        date: z.string().optional().describe("Project date"),
        comment1: z.string().optional().describe("Comment 1"),
        comment2: z.string().optional().describe("Comment 2"),
        comment3: z.string().optional().describe("Comment 3"),
        comment4: z.string().optional().describe("Comment 4")
    }, async (properties: { title?: string, company?: string, revision?: string, date?: string, comment1?: string, comment2?: string, comment3?: string, comment4?: string }) => {
        logger.debug('Setting project properties');
        const result = await callKicadScript("set_project_properties", properties);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Import Project Tool
    // ------------------------------------------------------
    server.tool("import_project", {
        filename: z.string().describe("Path to the source project file"),
        format: z.enum(["eagle", "altium", "orcad"]).describe("Format of the source project"),
        outputPath: z.string().describe("Directory path where the KiCAD project should be created")
    }, async ({ filename, format, outputPath }: { filename: string, format: string, outputPath: string }) => {
        logger.debug(`Importing ${format} project from ${filename}`);
        const result = await callKicadScript("import_project", {
            filename,
            format,
            outputPath
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Create Backup Tool
    // ------------------------------------------------------
    server.tool("create_backup", {
        backupPath: z.string().optional().describe("Optional directory path for the backup (default: project directory)")
    }, async ({ backupPath }: { backupPath?: string }) => {
        logger.debug(`Creating project backup${backupPath ? ` at ${backupPath}` : ''}`);
        const result = await callKicadScript("create_backup", { backupPath });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Archive Project Tool
    // ------------------------------------------------------
    server.tool("archive_project", {
        outputPath: z.string().describe("Path where the archive should be created"),
        includeLibraries: z.boolean().optional().describe("Whether to include project libraries"),
        include3dModels: z.boolean().optional().describe("Whether to include 3D models")
    }, async ({ outputPath, includeLibraries, include3dModels }: { outputPath: string, includeLibraries?: boolean, include3dModels?: boolean }) => {
        logger.debug(`Archiving project to ${outputPath}`);
        const result = await callKicadScript("archive_project", {
            outputPath,
            includeLibraries,
            include3dModels
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    logger.info('Project management tools registered');
}
