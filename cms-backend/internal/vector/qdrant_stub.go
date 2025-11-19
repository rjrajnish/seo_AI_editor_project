package vector

type Client struct{ Url string }

func New(url string) *Client { return &Client{ Url: url } }

type SearchResult struct{ ID string; Score float32; Payload map[string]interface{} }

func (c *Client) Upsert(col, id string, vector []float32, payload map[string]interface{}) error { return nil }
func (c *Client) Search(col string, vector []float32, topK int) ([]SearchResult, error) { return nil, nil }
