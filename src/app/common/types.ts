export type HeadersType = {
    'Content-Type': string;
    'Authorization': string;
};

type FunctionParameter = {
    type: string;
    properties: {
        [key: string]: {
            type: string;
            description: string;
        };
    };
    required: string[];
};

export type ToolFunction = {
    name: string;
    description: string;
    parameters: FunctionParameter;
};

export type Tool = {
    type: "function";
    function: ToolFunction;
};

export type ToolAndChoice = {
    tools?: Tool[];
    tool_choice?: "auto" | "none";
}
export type BodyType = {
    messages: { role: string; content: string }[];
    model?: string;
    tools?: Tool[];
    tool_choice?: "auto" | "none";
};