package controllers

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/repositories"
)

type ArticleController struct {
	Repo *repositories.ArticleRepo
	Cfg  config.Config
}

func NewArticleController(db *mongo.Database, cfg config.Config) *ArticleController {
	return &ArticleController{Repo: repositories.NewArticleRepo(db), Cfg: cfg}
}

func (a *ArticleController) Create(c *fiber.Ctx) error {
	var body models.Article

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid json: " + err.Error()})
	}

	body.Title = strings.TrimSpace(body.Title)
	body.Content = strings.TrimSpace(body.Content)
	if body.Title == "" || body.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "title and content are required"})
	}

	if body.Status == "" {
		body.Status = "draft"
	}

	body.ID = primitive.NewObjectID()
	body.UUID = primitive.NewObjectID().Hex()
	body.SeoScore = calculateSEOScore(body.Content)

	now := time.Now()
	body.CreatedAt = now
	body.UpdatedAt = now

	if err := a.Repo.Create(context.Background(), &body); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(body)
}

func (a *ArticleController) List(c *fiber.Ctx) error {
	out, err := a.Repo.List(context.Background())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(out)
}

func (a *ArticleController) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}
	art, repoErr := a.Repo.FindByID(context.Background(), oid)
	if repoErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": repoErr.Error()})
	}
	if art == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
	}
	return c.JSON(art)
}

func (a *ArticleController) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	var body map[string]interface{}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid body"})
	}

	if title, ok := body["title"].(string); ok {
		title = strings.TrimSpace(title)
		if title == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "title cannot be empty"})
		}
		body["title"] = title
	}

	if content, ok := body["content"].(string); ok {
		content = strings.TrimSpace(content)
		if content == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "content cannot be empty"})
		}
		body["content"] = content
		body["seo_score"] = calculateSEOScore(content)
	}

	body["updated_at"] = time.Now()
	if err := a.Repo.Update(context.Background(), oid, body); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"ok": true})
}

func (a *ArticleController) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	if err := a.Repo.Delete(context.Background(), oid); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"ok": true})
}

func (a *ArticleController) ListAdvanced(c *fiber.Ctx) error {
	search := c.Query("search", "")
	status := c.Query("status", "")

	page, _ := strconv.Atoi(c.Query("page", "1"))
	if page < 1 {
		page = 1
	}

	limit := 10
	skip := (page - 1) * limit

	articles, err := a.Repo.ListAdvanced(context.Background(), search, status, skip, limit)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	total, countErr := a.Repo.Count(context.Background(), search, status)
	if countErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": countErr.Error()})
	}

	return c.JSON(fiber.Map{
		"data":  articles,
		"page":  page,
		"limit": limit,
		"total": total,
	})
}

func (a *ArticleController) UpdateStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	var body struct {
		Status string `json:"status"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid json"})
	}

	status := strings.TrimSpace(strings.ToLower(body.Status))
	if status != "draft" && status != "in_progress" && status != "published" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid status"})
	}

	update := map[string]interface{}{
		"status":     status,
		"updated_at": time.Now(),
	}

	if err := a.Repo.Update(context.Background(), oid, update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"ok": true})
}

func (a *ArticleController) GetSEOScore(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	art, repoErr := a.Repo.FindByID(context.Background(), oid)
	if repoErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": repoErr.Error()})
	}
	if art == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "not found"})
	}

	seoScore := calculateSEOScore(art.Content)
	if art.SeoScore != seoScore {
		_ = a.Repo.Update(context.Background(), oid, map[string]interface{}{
			"seo_score":  seoScore,
			"updated_at": time.Now(),
		})
	}

	return c.JSON(fiber.Map{"seo_score": seoScore})
}

func calculateSEOScore(content string) int {
	length := len(strings.TrimSpace(content))
	score := 50

	switch {
	case length > 2400:
		score += 30
	case length > 1600:
		score += 24
	case length > 900:
		score += 16
	case length > 400:
		score += 10
	default:
		score += 4
	}

	if strings.Contains(strings.ToLower(content), "seo") {
		score += 8
	}
	if strings.Contains(strings.ToLower(content), "keyword") {
		score += 6
	}

	if score > 100 {
		score = 100
	}
	if score < 0 {
		score = 0
	}

	return score
}
