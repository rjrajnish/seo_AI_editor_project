package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
)

type AIController struct{ Cfg config.Config }

func NewAIController(db interface{}, cfg config.Config) *AIController{ return &AIController{ Cfg: cfg } }

func (a *AIController) GenerateTitle(c *fiber.Ctx) error {
	var body struct{ Topic string }
	if err := c.BodyParser(&body); err!=nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }
	return c.JSON(fiber.Map{"titles": []string{"AI: " + body.Topic}})
}

func (a *AIController) GenerateOutline(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"outline": []string{"Intro","Section 1","Section 2","Conclusion"}})
}

func (a *AIController) AnalyzeKeyword(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"keyword_analysis": map[string]interface{}{"search_volume_estimate":"10k-30k","competition_level":"Medium","difficulty":50}})
}
