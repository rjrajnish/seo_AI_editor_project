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
)

type ArticleController struct{ Repo *repositories.ArticleRepo; Cfg config.Config }

func NewArticleController(db *mongo.Database, cfg config.Config) *ArticleController {
	return &ArticleController{ Repo: repositories.NewArticleRepo(db), Cfg: cfg }
}

func (a *ArticleController) Create(c *fiber.Ctx) error {
    var body models.Article

    if err := c.BodyParser(&body); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "invalid json: " + err.Error()})
    }

    body.ID = primitive.NewObjectID()
    body.UUID = primitive.NewObjectID().Hex()

    now := time.Now()
    body.CreatedAt = now
    body.UpdatedAt = now

    if err := a.Repo.Create(context.Background(), &body); err != nil {
        return c.Status(500).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(body)
}


func (a *ArticleController) List(c *fiber.Ctx) error {
	out, err := a.Repo.List(context.Background())
	if err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
	return c.JSON(out)
}

func (a *ArticleController) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid id"}) }
	art, err := a.Repo.FindByID(context.Background(), oid)
	if err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
	if art==nil { return c.Status(404).JSON(fiber.Map{"error":"not found"}) }
	return c.JSON(art)
}

func (a *ArticleController) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, _ := primitive.ObjectIDFromHex(id)
	var body map[string]interface{}
	if err := c.BodyParser(&body); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }
	body["updated_at"] = primitive.NewDateTimeFromTime(time.Now())
	if err := a.Repo.Update(context.Background(), oid, body); err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
	return c.JSON(fiber.Map{"ok":true})
}

func (a *ArticleController) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	oid, _ := primitive.ObjectIDFromHex(id)
	if err := a.Repo.Delete(context.Background(), oid); err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
	return c.JSON(fiber.Map{"ok":true})
}
