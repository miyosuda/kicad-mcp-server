/**
 * Routing tools for KiCAD MCP server
 *
 * These tools handle trace routing, via placement, and net management
 */
import { z } from 'zod';
import { logger } from '../logger.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Command function type for KiCAD script calls
type CommandFunction = (command: string, params: Record<string, unknown>) => Promise<any>;

/**
 * Register routing tools with the MCP server
 *
 * @param server MCP server instance
 * @param callKicadScript Function to call KiCAD script commands
 */
export function registerRoutingTools(server: McpServer, callKicadScript: CommandFunction) {
    logger.info('Registering routing tools');
    // ------------------------------------------------------
    // Add Net Tool
    // ------------------------------------------------------
    server.tool("add_net", {
        name: z.string().describe("Name of the net"),
        class: z.string().optional().describe("Optional net class")
    }, async ({ name, class: netClass }) => {
        logger.debug(`Adding net: ${name}`);
        const result = await callKicadScript("add_net", { name, class: netClass });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Route Trace Tool
    // ------------------------------------------------------
    server.tool("route_trace", {
        start: z.object({
            x: z.number().optional(),
            y: z.number().optional(),
            unit: z.enum(["mm", "inch"]).optional(),
            pad: z.string().optional(),
            componentRef: z.string().optional()
        }).describe("Start point (can be coordinates or pad)"),
        end: z.object({
            x: z.number().optional(),
            y: z.number().optional(),
            unit: z.enum(["mm", "inch"]).optional(),
            pad: z.string().optional(),
            componentRef: z.string().optional()
        }).describe("End point (can be coordinates or pad)"),
        layer: z.string().describe("Layer to route on (e.g., 'F.Cu')"),
        width: z.number().optional().describe("Optional trace width"),
        net: z.string().optional().describe("Optional net name"),
        via: z.boolean().optional().describe("Whether to add vias if needed")
    }, async ({ start, end, layer, width, net, via }) => {
        logger.debug(`Routing trace on layer ${layer}`);
        const result = await callKicadScript("route_trace", {
            start,
            end,
            layer,
            width,
            net,
            via
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Add Via Tool
    // ------------------------------------------------------
    server.tool("add_via", {
        position: z.object({
            x: z.number().describe("X coordinate"),
            y: z.number().describe("Y coordinate"),
            unit: z.enum(["mm", "inch"]).describe("Unit of measurement")
        }).describe("Position coordinates and unit"),
        size: z.number().optional().describe("Optional via diameter"),
        drill: z.number().optional().describe("Optional drill hole diameter"),
        net: z.string().optional().describe("Optional net name"),
        from_layer: z.string().optional().describe("Starting layer for the via"),
        to_layer: z.string().optional().describe("Ending layer for the via")
    }, async ({ position, size, drill, net, from_layer, to_layer }) => {
        logger.debug(`Adding via at (${position.x},${position.y}) ${position.unit}`);
        const result = await callKicadScript("add_via", {
            position,
            size,
            drill,
            net,
            from_layer,
            to_layer
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Delete Trace Tool
    // ------------------------------------------------------
    server.tool("delete_trace", {
        traceUuid: z.string().optional().describe("UUID of the trace to delete"),
        position: z.object({
            x: z.number().optional(),
            y: z.number().optional(),
            unit: z.enum(["mm", "inch"]).optional()
        }).optional().describe("Position to look for trace (if UUID not provided)")
    }, async ({ traceUuid, position }) => {
        if (traceUuid) {
            logger.debug(`Deleting trace with UUID: ${traceUuid}`);
        }
        else {
            logger.debug(`Deleting trace at position: (${position?.x},${position?.y}) ${position?.unit}`);
        }
        const result = await callKicadScript("delete_trace", { traceUuid, position });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    
    // ------------------------------------------------------
    // Auto-Route Net Tool
    // ------------------------------------------------------
    server.tool("auto_route_net", {
        net: z.string().describe("Name of the net to auto-route"),
        layer: z.string().optional().describe("Optional preferred layer"),
        width: z.number().optional().describe("Optional trace width")
    }, async ({ net, layer, width }) => {
        logger.debug(`Auto-routing net: ${net}`);
        const result = await callKicadScript("auto_route_net", {
            net,
            layer,
            width
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });

    // ------------------------------------------------------
    // Add Differential Pair Tool
    // ------------------------------------------------------
    server.tool("route_differential_pair", {
        positive_net: z.string().describe("Name of the positive net"),
        negative_net: z.string().describe("Name of the negative net"),
        start: z.object({
            x: z.number().optional(),
            y: z.number().optional(),
            unit: z.enum(["mm", "inch"]).optional(),
            pad_pos: z.string().optional(),
            pad_neg: z.string().optional(),
            componentRef: z.string().optional()
        }).describe("Start point for differential pair"),
        end: z.object({
            x: z.number().optional(),
            y: z.number().optional(),
            unit: z.enum(["mm", "inch"]).optional(),
            pad_pos: z.string().optional(),
            pad_neg: z.string().optional(),
            componentRef: z.string().optional()
        }).describe("End point for differential pair"),
        layer: z.string().describe("Layer to route on"),
        width: z.number().optional().describe("Trace width"),
        gap: z.number().optional().describe("Gap between the pair traces"),
        impedance: z.number().optional().describe("Target differential impedance (ohms)")
    }, async ({ positive_net, negative_net, start, end, layer, width, gap, impedance }) => {
        logger.debug(`Routing differential pair: ${positive_net}/${negative_net}`);
        const result = await callKicadScript("route_differential_pair", {
            positive_net,
            negative_net,
            start,
            end,
            layer,
            width,
            gap,
            impedance
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });

    // ------------------------------------------------------
    // Import Netlist Tool
    // ------------------------------------------------------
    server.tool("import_netlist", {
        filename: z.string().describe("Path to the netlist file"),
        replace_all: z.boolean().optional().describe("Whether to replace all existing connections")
    }, async ({ filename, replace_all }) => {
        logger.debug(`Importing netlist from file: ${filename}`);
        const result = await callKicadScript("import_netlist", {
            filename,
            replace_all
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Calculate Trace Width Tool
    // ------------------------------------------------------
    server.tool("calculate_trace_width", {
        current: z.number().describe("Current in amperes"),
        temperature_rise: z.number().describe("Allowable temperature rise in degrees Celsius"),
        copper_thickness: z.number().optional().describe("Copper thickness in oz/ft² (default: 1oz)"),
        ambient_temperature: z.number().optional().describe("Ambient temperature in degrees Celsius")
    }, async ({ current, temperature_rise, copper_thickness, ambient_temperature }) => {
        logger.debug(`Calculating trace width for ${current}A with ${temperature_rise}°C rise`);
        const result = await callKicadScript("calculate_trace_width", {
            current,
            temperature_rise,
            copper_thickness,
            ambient_temperature
        });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    // ------------------------------------------------------
    // Get Net Information Tool
    // ------------------------------------------------------
    server.tool("get_net_info", {
        net: z.string().describe("Name of the net")
    }, async ({ net }: { net: string }) => {
        logger.debug(`Getting information for net: ${net}`);
        const result = await callKicadScript("get_net_info", { net });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result)
                }]
        };
    });
    logger.info('Routing tools registered');
}
