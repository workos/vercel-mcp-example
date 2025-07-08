import SwaggerParser from 'swagger-parser';
import { z } from 'zod';
import { User } from './auth/types';

// OpenAPI specification type definitions
interface OpenAPIParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie' | 'body';
  required?: boolean;
  schema?: {
    type?: string;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
  };
  description?: string;
}

interface OpenAPIRequestBody {
  content?: {
    'application/json'?: {
      schema?: {
        properties?: Record<string, unknown>;
      };
    };
  };
}

interface OpenAPIOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
}

interface OpenAPIPathItem {
  [method: string]: OpenAPIOperation | undefined;
}

interface OpenAPISpec {
  paths?: Record<string, OpenAPIPathItem>;
}

export interface OpenAPIConfig {
  specUrl: string;
  baseUrl: string;
  apiKey?: string;
  userIdHeader?: string; // Header to send user ID in
  authHeader?: string; // Header for API authentication
}

export interface MCPTool {
  name: string;
  description: string;
  schema?: Record<string, z.ZodTypeAny>;
  handler: (args: Record<string, unknown>) => Promise<{
    content: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

/**
 * Generate MCP tools from OpenAPI specification
 */
export async function generateMcpToolsFromOpenAPI(
  config: OpenAPIConfig,
  user: User
): Promise<MCPTool[]> {
  try {
    // WORKAROUND: The swagger-parser types are not compatible with modern ES modules.
    // Using type assertion to work with the library
    const api = await (
      SwaggerParser as unknown as {
        parse: (url: string) => Promise<OpenAPISpec>;
      }
    ).parse(config.specUrl);
    const tools: MCPTool[] = [];

    // Process each path and operation
    for (const [path, pathItem] of Object.entries(api.paths || {})) {
      if (!pathItem || typeof pathItem !== 'object') continue;

      for (const [method, operation] of Object.entries(pathItem)) {
        if (
          !operation ||
          typeof operation !== 'object' ||
          !operation.operationId
        )
          continue;

        const tool = createMCPToolFromOperation(
          path,
          method.toUpperCase(),
          operation,
          config,
          user
        );

        if (tool) {
          tools.push(tool);
        }
      }
    }

    return tools;
  } catch (error) {
    console.error('Error generating MCP tools from OpenAPI spec:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to process OpenAPI spec: ${error.message}`);
    }
    throw new Error('Failed to process OpenAPI spec');
  }
}

/**
 * Create a single MCP tool from an OpenAPI operation
 */
function createMCPToolFromOperation(
  path: string,
  method: string,
  operation: OpenAPIOperation,
  config: OpenAPIConfig,
  user: User
): MCPTool | null {
  const toolName =
    operation.operationId ||
    `${method.toLowerCase()}${path.replace(/[^a-zA-Z0-9]/g, '')}`;
  const description =
    operation.summary || operation.description || `${method} ${path}`;

  // Generate Zod schema from parameters
  const schema = generateZodSchemaFromParameters(operation.parameters || []);

  // Create the handler function which closes over the user object
  const handler = async (args: Record<string, unknown>) => {
    try {
      const url = buildRequestUrl(
        config.baseUrl,
        path,
        args,
        operation.parameters || []
      );
      const requestOptions = buildRequestOptions(
        method,
        args,
        operation,
        config,
        user
      );

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              data,
              operation: operation.operationId,
            }),
          },
        ],
      };
    } catch (error) {
      console.error(`Error in ${toolName}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : 'API request failed';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'error',
              message: errorMessage,
              operation: operation.operationId,
            }),
          },
        ],
      };
    }
  };

  return {
    name: toolName,
    description,
    schema: Object.keys(schema).length > 0 ? z.object(schema).shape : undefined,
    handler,
  };
}

/**
 * Generate Zod schema from OpenAPI parameters
 */
function generateZodSchemaFromParameters(
  parameters: OpenAPIParameter[]
): Record<string, z.ZodTypeAny> {
  const schema: Record<string, z.ZodTypeAny> = {};

  for (const param of parameters) {
    if (!param.name || !param.schema) continue;

    let zodType;

    switch (param.schema.type) {
      case 'string':
        zodType = z.string();
        if (param.schema.minLength)
          zodType = zodType.min(param.schema.minLength);
        if (param.schema.maxLength)
          zodType = zodType.max(param.schema.maxLength);
        break;
      case 'integer':
      case 'number':
        zodType = z.number();
        if (param.schema.minimum) zodType = zodType.min(param.schema.minimum);
        if (param.schema.maximum) zodType = zodType.max(param.schema.maximum);
        break;
      case 'boolean':
        zodType = z.boolean();
        break;
      case 'array':
        zodType = z.array(z.unknown()); // Could be more sophisticated
        break;
      default:
        zodType = z.unknown();
    }

    if (!param.required) {
      zodType = zodType.optional();
    }

    if (param.description) {
      zodType = zodType.describe(param.description);
    }

    schema[param.name] = zodType;
  }

  return schema;
}

/**
 * Build the full request URL with path and query parameters
 */
function buildRequestUrl(
  baseUrl: string,
  path: string,
  args: Record<string, unknown>,
  parameters: OpenAPIParameter[]
): string {
  let finalUrl = baseUrl + path;
  const queryParams = new URLSearchParams();

  // Replace path parameters
  for (const param of parameters) {
    if (param.in === 'path' && args[param.name] !== undefined) {
      finalUrl = finalUrl.replace(
        `{${param.name}}`,
        encodeURIComponent(String(args[param.name]))
      );
    }
  }

  // Add query parameters
  for (const param of parameters) {
    if (param.in === 'query' && args[param.name] !== undefined) {
      queryParams.append(param.name, String(args[param.name]));
    }
  }

  const queryString = queryParams.toString();
  return queryString ? `${finalUrl}?${queryString}` : finalUrl;
}

/**
 * Build request options including headers and body
 */
function buildRequestOptions(
  method: string,
  args: Record<string, unknown>,
  operation: OpenAPIOperation,
  config: OpenAPIConfig,
  user: User
): RequestInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add API authentication
  if (config.authHeader && config.apiKey) {
    headers[config.authHeader] = config.apiKey;
  }

  // Add user context
  if (config.userIdHeader) {
    headers[config.userIdHeader] = user.id;
  }

  // Add header parameters
  for (const param of operation.parameters || []) {
    if (param.in === 'header' && args[param.name] !== undefined) {
      headers[param.name] = String(args[param.name]);
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  // Add request body for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const requestBody = operation.requestBody;
    if (
      requestBody &&
      requestBody.content &&
      requestBody.content['application/json']
    ) {
      let body: Record<string, unknown> = {};
      const schema = requestBody.content?.['application/json']?.schema;
      if (schema && schema.properties) {
        for (const prop in schema.properties) {
          if (args[prop] !== undefined) {
            body[prop] = args[prop];
          }
        }
      } else {
        // fallback for simple body
        const bodyParam = (operation.parameters || []).find(
          (p: OpenAPIParameter) => p.in === 'body'
        );
        if (bodyParam && args[bodyParam.name] !== undefined) {
          body = args[bodyParam.name] as Record<string, unknown>;
        }
      }
      if (Object.keys(body).length > 0) {
        options.body = JSON.stringify(body);
      }
    }
  }

  return options;
}

/**
 * Utility to validate and load OpenAPI config from environment
 */
export function getOpenAPIConfigFromEnv(): OpenAPIConfig | null {
  const specUrl = process.env.OPENAPI_SPEC_URL;
  const baseUrl = process.env.OPENAPI_BASE_URL;

  if (!specUrl || !baseUrl) {
    return null;
  }

  return {
    specUrl,
    baseUrl,
    apiKey: process.env.OPENAPI_API_KEY,
    userIdHeader: process.env.OPENAPI_USER_ID_HEADER || 'X-User-ID',
    authHeader: process.env.OPENAPI_AUTH_HEADER || 'Authorization',
  };
}
