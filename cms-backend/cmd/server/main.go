package main

import (
	"context"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	flog "github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/api"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/services"
)

func main() {
	_ = godotenv.Load()

	cfg := config.LoadConfig()
services.PrintGeminiModels(cfg.GeminiAPIKey)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatal(err)
	}
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("mongo ping failed: ", err)
	}

	db := client.Database(cfg.DBName)

	app := fiber.New()

	// =====================
	//     ENABLE CORS
	// =====================
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	app.Use(flog.New())

	api.Register(app, db, cfg)

	log.Println("starting server on :" + cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
