
package controllers

import (
    "context"
    "time"

    "github.com/gofiber/fiber/v2"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "github.com/example/cms-backend/internal/models"
    "github.com/example/cms-backend/internal/repositories"
    "github.com/example/cms-backend/internal/config"
)

type ArticleController struct { repo *repositories.ArticleRepository; cfg config.Config }

func NewArticleController(db *mongo.Database, cfg config.Config) *ArticleController{
    return &ArticleController{ repo: repositories.NewArticleRepository(db), cfg: cfg }
}

func (ac *ArticleController) Create(c *fiber.Ctx) error{
    var body models.Article
    if err := c.BodyParser(&body); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }
    body.ID = primitive.NewObjectID()
    body.UUID = primitive.NewObjectID().Hex()
    body.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
    body.UpdatedAt = body.CreatedAt
    if err := ac.repo.Create(context.Background(), &body); err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
    return c.JSON(body)
}

func (ac *ArticleController) List(c *fiber.Ctx) error{
    items, err := ac.repo.List(context.Background())
    if err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
    return c.JSON(items)
}

func (ac *ArticleController) GetByID(c *fiber.Ctx) error{
    id := c.Params("id")
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid id"}) }
    a, err := ac.repo.FindByID(context.Background(), oid)
    if err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
    if a==nil { return c.Status(404).JSON(fiber.Map{"error":"not found"}) }
    return c.JSON(a)
}

func (ac *ArticleController) Update(c *fiber.Ctx) error{
    id := c.Params("id")
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid id"}) }
    var body map[string]interface{}
    if err := c.BodyParser(&body); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }
    body["updated_at"] = primitive.NewDateTimeFromTime(time.Now())
    if err := ac.repo.Update(context.Background(), oid, body); err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
    return c.JSON(fiber.Map{"ok":true})
}

func (ac *ArticleController) Delete(c *fiber.Ctx) error{
    id := c.Params("id")
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid id"}) }
    if err := ac.repo.Delete(context.Background(), oid); err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
    return c.JSON(fiber.Map{"ok":true})
}
