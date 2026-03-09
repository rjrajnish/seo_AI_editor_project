package controllers

import (
	"context"
	"strings"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/repositories"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/services"
)

type SEOController struct {
	Repo    *repositories.SEORepo
	Service *services.SEOService
	Cfg     config.Config
}

func NewSEOController(db *mongo.Database, cfg config.Config) *SEOController {
	service, err := services.NewSEOService(cfg.GeminiAPIKey)
	if err != nil {
		service = nil
	}

	return &SEOController{
		Repo:    repositories.NewSEORepo(db),
		Service: service,
		Cfg:     cfg,
	}
}

func (s *SEOController) AnalyzeKeyword(c *fiber.Ctx) error {
	if s.Service == nil {
		return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
			"error": "SEO service is not configured",
		})
	}

	var body struct {
		Keyword string `json:"keyword"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

	keyword := strings.TrimSpace(body.Keyword)
	if keyword == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "keyword is required"})
	}

	seo, err := s.Service.GenerateSEOInsight(keyword)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if saveErr := s.Repo.Save(context.Background(), seo); saveErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to store seo insight"})
	}

	return c.JSON(seo)
}
