
package main

import (
    "context"
    "log"
    "time"

    "github.com/gofiber/fiber/v2"
    flog "github.com/gofiber/fiber/v2/middleware/logger"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"

    "github.com/example/cms-backend/internal/api"
    "github.com/example/cms-backend/internal/config"
)

func main() {
    cfg := config.LoadConfig()

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
    if err != nil { log.Fatal(err) }
    if err := client.Ping(ctx, nil); err != nil { log.Fatal("mongo ping failed: ", err) }
    db := client.Database(cfg.DBName)

    app := fiber.New()
    app.Use(flog.New())

    api.SetupRoutes(app, db, cfg)

    port := cfg.Port
    if port == "" { port = "8080" }
    log.Println("server starting on :" + port)
    log.Fatal(app.Listen(":" + port))
}
