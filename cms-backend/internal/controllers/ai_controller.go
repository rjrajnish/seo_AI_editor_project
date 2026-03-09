package controllers

import (
	"context"
	"errors"
	"strings"
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
	aiService, err := services.NewAIService(cfg.GeminiAPIKey)
	if err != nil {
		aiService = nil
	}

	return &AIController{
		Repo:    repositories.NewAIRepo(db),
		Service: aiService,
		Cfg:     cfg,
	}
}

func (a *AIController) requireService(c *fiber.Ctx) error {
	if a.Service != nil {
		return nil
	}
	return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
		"error": "AI service is not configured",
	})
}

func (a *AIController) parseTopic(c *fiber.Ctx) (string, error) {
	var body struct {
		Topic string `json:"topic"`
	}

	if err := c.BodyParser(&body); err != nil {
		return "", errors.New("invalid body")
	}

	topic := strings.TrimSpace(body.Topic)
	if topic == "" {
		return "", errors.New("topic is required")
	}

	return topic, nil
}

func (a *AIController) GenerateTitle(c *fiber.Ctx) error {
	if err := a.requireService(c); err != nil {
		return err
	}

	topic, err := a.parseTopic(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	titles, genErr := a.Service.GenerateTitle(topic)
	if genErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": genErr.Error()})
	}

	return c.JSON(fiber.Map{"result": titles})
}

func (a *AIController) GenerateOutline(c *fiber.Ctx) error {
	if err := a.requireService(c); err != nil {
		return err
	}

	topic, err := a.parseTopic(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	outline, genErr := a.Service.GenerateOutline(topic)
	if genErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": genErr.Error()})
	}

	return c.JSON(fiber.Map{"result": outline})
}

func (a *AIController) GenerateMeta(c *fiber.Ctx) error {
	if err := a.requireService(c); err != nil {
		return err
	}

	topic, err := a.parseTopic(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	meta, genErr := a.Service.GenerateMeta(topic)
	if genErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": genErr.Error()})
	}

	return c.JSON(fiber.Map{"result": meta})
}

func (a *AIController) GenerateKeywords(c *fiber.Ctx) error {
	if err := a.requireService(c); err != nil {
		return err
	}

	topic, err := a.parseTopic(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	keywords, genErr := a.Service.GenerateKeywords(topic)
	if genErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": genErr.Error()})
	}

	return c.JSON(fiber.Map{"result": keywords})
}

func (a *AIController) GenerateArticle(c *fiber.Ctx) error {
	if err := a.requireService(c); err != nil {
		return err
	}

	topic, err := a.parseTopic(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	article, genErr := a.Service.GenerateArticle(topic)
	if genErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": genErr.Error()})
	}

	return c.JSON(fiber.Map{"result": article})
}

// Prompt editor
func (a *AIController) SavePrompt(c *fiber.Ctx) error {
	var body struct {
		Title    string `json:"title"`
		Template string `json:"template"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

	title := strings.TrimSpace(body.Title)
	template := strings.TrimSpace(body.Template)
	if title == "" || template == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "title and template are required"})
	}

	p := &models.AIPrompt{
		ID:        primitive.NewObjectID(),
		Title:     title,
		Template:  template,
		CreatedAt: primitive.NewDateTimeFromTime(time.Now()),
	}

	if err := a.Repo.SavePrompt(context.Background(), p); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to save prompt"})
	}
	return c.JSON(p)
}

func (a *AIController) ListPrompts(c *fiber.Ctx) error {
	out, err := a.Repo.ListPrompts(context.Background())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to list prompts"})
	}
	return c.JSON(out)
}
