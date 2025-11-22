package controllers

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
    return &SEOController{
        Repo:    repositories.NewSEORepo(db),
        Service: services.NewSEOService(),
        Cfg:     cfg,
    }
}

func (s *SEOController) Analyze(c *fiber.Ctx) error {

    var body struct {
        Keyword string `json:"keyword"`
    }

    if err := c.BodyParser(&body); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
    }

    seo := s.Service.GenerateSEOInsight(body.Keyword)
    seo.ID = primitive.NewObjectID()

    _ = s.Repo.Save(context.Background(), seo)

    return c.JSON(seo)
}
