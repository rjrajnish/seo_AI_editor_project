package api

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/controllers"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/middleware"
)

func Register(app *fiber.App, db *mongo.Database, cfg config.Config) {
	// public
	app.Get("/health", func(c *fiber.Ctx) error { return c.SendString("OK") })

	userCtrl := controllers.NewUserController(db, cfg)
	auth := app.Group("/api/v1/auth")
	auth.Post("/register", userCtrl.Register)
	auth.Post("/login", userCtrl.Login)

	// protected routes (JWT middleware)
	api := app.Group("/api/v1", middleware.JWTMiddleware(cfg.JWTSecret))

	articleCtrl := controllers.NewArticleController(db, cfg)
	api.Post("/articles", articleCtrl.Create)
	api.Get("/articles/:id", articleCtrl.GetByID)
	api.Put("/articles/:id", articleCtrl.Update)
	api.Delete("/articles/:id", articleCtrl.Delete)
	api.Get("/articles", articleCtrl.ListAdvanced)
	api.Patch("/articles/:id/status", articleCtrl.UpdateStatus)
	api.Get("/articles/:id/seo", articleCtrl.GetSEOScore)

	settingsCtrl := controllers.NewSettingsController(db, cfg)
	api.Get("/settings", settingsCtrl.GetSettings)
	api.Put("/settings", settingsCtrl.UpdateSettings)

	seoCtrl := controllers.NewSEOController(db, cfg)
	api.Post("/seo/intelligence", seoCtrl.AnalyzeKeyword)

	aiCtrl := controllers.NewAIController(db, cfg)
	ai := api.Group("/ai")
	ai.Post("/title", aiCtrl.GenerateTitle)
	ai.Post("/outline", aiCtrl.GenerateOutline)
	ai.Post("/meta", aiCtrl.GenerateMeta)
	ai.Post("/keywords", aiCtrl.GenerateKeywords)
	ai.Post("/article", aiCtrl.GenerateArticle)
	ai.Post("/prompts", aiCtrl.SavePrompt)
	ai.Get("/prompts", aiCtrl.ListPrompts)
}
