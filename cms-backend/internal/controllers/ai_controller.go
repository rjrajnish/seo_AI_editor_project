package controllers

import (
	"context"
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
    return &AIController{
        Repo:    repositories.NewAIRepo(db),
        Service: services.NewAIService(),
        Cfg:     cfg,
    }
}

// ------------------ AI TOOLS ------------------

func (a *AIController) GenerateTitle(c *fiber.Ctx) error {
    var body struct{ Topic string `json:"topic"` }

    if err := c.BodyParser(&body); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
    }

    return c.JSON(fiber.Map{"titles": a.Service.GenerateTitle(body.Topic)})
}

func (a *AIController) GenerateOutline(c *fiber.Ctx) error {
    var body struct{ Topic string `json:"topic"` }
    c.BodyParser(&body)

    return c.JSON(fiber.Map{"outline": a.Service.GenerateOutline(body.Topic)})
}

func (a *AIController) GenerateMeta(c *fiber.Ctx) error {
    var body struct{ Topic string `json:"topic"` }
    c.BodyParser(&body)

    return c.JSON(fiber.Map{"meta_description": a.Service.GenerateMeta(body.Topic)})
}

func (a *AIController) GenerateKeywords(c *fiber.Ctx) error {
    var body struct{ Topic string `json:"topic"` }
    c.BodyParser(&body)

    return c.JSON(fiber.Map{"keywords": a.Service.GenerateKeywords(body.Topic)})
}

func (a *AIController) GenerateArticle(c *fiber.Ctx) error {
    var body struct{ Topic string `json:"topic"` }
    c.BodyParser(&body)

    return c.JSON(fiber.Map{"article": a.Service.GenerateArticle(body.Topic)})
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
