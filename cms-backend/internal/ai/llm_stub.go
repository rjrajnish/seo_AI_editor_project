package ai

type Client struct{ ApiKey string }

func NewClient(apiKey string) *Client { return &Client{ApiKey: apiKey} }

func (c *Client) Generate(prompt string) (string, error) { return "This is a generated response for: " + prompt, nil }
func (c *Client) Embedding(text string) ([]float32, error) { return []float32{}, nil }
