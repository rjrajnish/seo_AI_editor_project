
package vector

// Stub Qdrant client - replace with real HTTP client to Qdrant
type Client struct{}

func NewClient(url, apiKey string) *Client { return &Client{} }

type SearchResult struct {
    ID string
    Score float32
    Payload map[string]interface{}
}
func (c *Client) Upsert(collection string, id string, vector []float32, payload map[string]interface{}) error { return nil }
func (c *Client) Search(collection string, vector []float32, topK int) ([]SearchResult, error) { return nil, nil }
