package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
)

type SettingsController struct{ Cfg config.Config }

func NewSettingsController(db interface{}, cfg config.Config) *SettingsController { return &SettingsController{ Cfg: cfg } }

func (s *SettingsController) GetSettings(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"defaults": map[string]interface{}{"default_category":"blog","default_seo_score":50}})
}

func (s *SettingsController) UpdateSettings(c *fiber.Ctx) error {
	var body map[string]interface{}
	if err := c.BodyParser(&body); err!=nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }
	return c.JSON(fiber.Map{"ok":true})
}
