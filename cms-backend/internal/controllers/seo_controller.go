package controllers

import (
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"

	"go.mongodb.org/mongo-driver/mongo"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/repositories"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/services"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
)

type SEOController struct {
    Repo    *repositories.SEORepo
    Service *services.SEOService
    Cfg     config.Config
}

func NewSEOController(db *mongo.Database, cfg config.Config) *SEOController {
    service, err := services.NewSEOService(cfg.GeminiAPIKey)
    if err != nil {
        panic(fmt.Errorf("failed to initialize SEOService: %v", err))
    }

    return &SEOController{
        Repo:    repositories.NewSEORepo(db),
        Service: service,
        Cfg:     cfg,
    }
}



func (s *SEOController) AnalyzeKeyword(c *fiber.Ctx) error {
    var body struct {
        Keyword string `json:"keyword"`
    }

    if err := c.BodyParser(&body); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
    }

    seo, err := s.Service.GenerateSEOInsight(body.Keyword)
if err != nil {
    fmt.Println("SEO Service Error:", err)
    return c.Status(500).JSON(fiber.Map{"error": err.Error()})
}


    _ = s.Repo.Save(context.Background(), seo)

    return c.JSON(seo)
}

