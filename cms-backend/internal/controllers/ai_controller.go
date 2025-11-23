package controllers

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/repositories"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/services"
)

type AIController struct {
	Repo    *repositories.AIRepo
	Service *services.AIService
	Cfg     config.Config
}

func NewAIController(db *mongo.Database, cfg config.Config) *AIController {

	// ⭐ AI Service now requires Gemini API key
	aiService, err := services.NewAIService(cfg.GeminiAPIKey)
	if err != nil {
		panic("Failed to initialize AIService: " + err.Error())
	}

	return &AIController{
		Repo:    repositories.NewAIRepo(db),
		Service: aiService,
		Cfg:     cfg,
	}
}
func (a *AIController) GenerateTitle(c *fiber.Ctx) error {
	var body struct{ Topic string `json:"topic"` }

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	titles, err := a.Service.GenerateTitle(body.Topic)
	if err != nil {
        fmt.Println("AI Service Error:", err)
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"titles": titles})
}
func (a *AIController) GenerateOutline(c *fiber.Ctx) error {
	var body struct{ Topic string `json:"topic"` }

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	outline, err := a.Service.GenerateOutline(body.Topic)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"outline": outline})
}
func (a *AIController) GenerateMeta(c *fiber.Ctx) error {
	var body struct{ Topic string `json:"topic"` }

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	meta, err := a.Service.GenerateMeta(body.Topic)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"meta_description": meta})
}
func (a *AIController) GenerateKeywords(c *fiber.Ctx) error {
	var body struct{ Topic string `json:"topic"` }

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	keywords, err := a.Service.GenerateKeywords(body.Topic)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"keywords": keywords})
}
func (a *AIController) GenerateArticle(c *fiber.Ctx) error {
	var body struct{ Topic string `json:"topic"` }

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}

	article, err := a.Service.GenerateArticle(body.Topic)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"article": article})
}

// ----------------- PROMPT EDITOR -----------------

func (a *AIController) SavePrompt(c *fiber.Ctx) error {
    var body struct {
        Title    string `json:"title"`
        Template string `json:"template"`
    }
    c.BodyParser(&body)

    p := &models.AIPrompt{
        ID:        primitive.NewObjectID(),
        Title:     body.Title,
        Template:  body.Template,
        CreatedAt: primitive.NewDateTimeFromTime(time.Now()),
    }

    a.Repo.SavePrompt(context.Background(), p)
    return c.JSON(p)
}

func (a *AIController) ListPrompts(c *fiber.Ctx) error {
    out, _ := a.Repo.ListPrompts(context.Background())
    return c.JSON(out)
}
