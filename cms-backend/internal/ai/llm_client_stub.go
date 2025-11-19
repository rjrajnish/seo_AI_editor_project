
package ai

// Stub LLM client - replace with real provider integration (OpenAI, etc.)

type Client struct{}

func NewClient(apiKey string) *Client { return &Client{} }

func (c *Client) GenerateTitle(prompt string) (string, error) {
    // Placeholder
    return "AI Generated Title: " + prompt, nil
}

func (c *Client) Embedding(text string) ([]float32, error) {
    // Return empty vector stub
    return []float32{}, nil
}
