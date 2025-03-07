export const environment = {
    production: false,
    // local .net api backend base url change to your instance
    backendEndpoint:'https://localhost:7032',
    apiUrl: 'https://models.inference.ai.azure.com/chat/completions',
    apiKey: 'github_pat_{repalcewith your own}',

    // Correct URL format for Azure OpenAI
    //'https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-name}/chat/completions?api-version=2025-01-01-preview',
    // set it to true if you want to use azure open ai else it will use the gpt models from github market place
    useAzureOpenAI: false
  };