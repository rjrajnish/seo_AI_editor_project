package controllers

import (
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
)

type SettingsController struct {
	Cfg      config.Config
	mu       sync.RWMutex
	settings map[string]interface{}
}

func NewSettingsController(db interface{}, cfg config.Config) *SettingsController {
	return &SettingsController{
		Cfg: cfg,
		settings: map[string]interface{}{
			"default_category":  "blog",
			"default_seo_score": 50,
		},
	}
}

func (s *SettingsController) GetSettings(c *fiber.Ctx) error {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return c.JSON(fiber.Map{"defaults": s.settings})
}

func (s *SettingsController) UpdateSettings(c *fiber.Ctx) error {
	var body struct {
		Defaults map[string]interface{} `json:"defaults"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid"})
	}

	if body.Defaults == nil {
		return c.Status(400).JSON(fiber.Map{"error": "defaults are required"})
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if v, ok := body.Defaults["default_category"]; ok {
		s.settings["default_category"] = v
	}
	if v, ok := body.Defaults["default_seo_score"]; ok {
		s.settings["default_seo_score"] = v
	}

	return c.JSON(fiber.Map{"ok": true, "defaults": s.settings})
}
