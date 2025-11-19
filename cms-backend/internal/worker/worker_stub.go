package worker

import "context"

func Start(ctx context.Context) { go func(){ <-ctx.Done() }() }
