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
	// api.Get("/articles", articleCtrl.List)
	api.Get("/articles/:id", articleCtrl.GetByID)
	api.Put("/articles/:id", articleCtrl.Update)
	api.Delete("/articles/:id", articleCtrl.Delete)
	// NEW — Advanced Content APIs (based on UI)
	api.Get("/articles", articleCtrl.ListAdvanced) // search + filter + pagination
 
	api.Patch("/articles/:uuid/status", articleCtrl.UpdateStatus) // update article status
	api.Get("/articles/:uuid/seo", articleCtrl.GetSEOScore)       // seo score
	 

	// aiCtrl := controllers.NewAIController(db, cfg)
	// api.Post("/ai/title", aiCtrl.GenerateTitle)
	// api.Post("/ai/outline", aiCtrl.GenerateOutline)

	settingsCtrl := controllers.NewSettingsController(db, cfg)
	api.Get("/settings", settingsCtrl.GetSettings)
	api.Put("/settings", settingsCtrl.UpdateSettings)

	seoCtrl := controllers.NewSEOController(db, cfg)
	api.Post("/seo/intelligence", seoCtrl.Analyze)

	ai := controllers.NewAIController(db, cfg)

	aiGroup := api.Group("/ai")

	aiGroup.Post("/title", ai.GenerateTitle)
	aiGroup.Post("/outline", ai.GenerateOutline)
	aiGroup.Post("/meta", ai.GenerateMeta)
	aiGroup.Post("/keywords", ai.GenerateKeywords)
	aiGroup.Post("/article", ai.GenerateArticle)

	aiGroup.Post("/prompts", ai.SavePrompt)
	aiGroup.Get("/prompts", ai.ListPrompts)

}
