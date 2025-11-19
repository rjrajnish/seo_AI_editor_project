
package controllers

import (
    "context"
    "time"

    "github.com/gofiber/fiber/v2"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "golang.org/x/crypto/bcrypt"
    "github.com/golang-jwt/jwt/v5"

    "github.com/example/cms-backend/internal/models"
    "github.com/example/cms-backend/internal/repositories"
    "github.com/example/cms-backend/internal/config"
)

type UserController struct{
    repo *repositories.UserRepo
    cfg config.Config
}

func NewUserController(db *mongo.Database, cfg config.Config) *UserController {
    return &UserController{ repo: repositories.NewUserRepo(db), cfg: cfg }
}

func (uc *UserController) Register(c *fiber.Ctx) error {
    var body struct{ Name, Email, Password string }
    if err := c.BodyParser(&body); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }

    hashed, _ := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
    u := &models.User{ ID: primitive.NewObjectID(), UUID: primitive.NewObjectID().Hex(), Name: body.Name, Email: body.Email, PasswordHash: string(hashed), Role: "author", CreatedAt: primitive.NewDateTimeFromTime(time.Now()) }

    if err := uc.repo.Create(context.Background(), u); err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
    return c.JSON(fiber.Map{"ok":true})
}

func (uc *UserController) Login(c *fiber.Ctx) error {
    var body struct{ Email, Password string }
    if err := c.BodyParser(&body); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }
    u, err := uc.repo.FindByEmail(context.Background(), body.Email)
    if err != nil || u==nil { return c.Status(401).JSON(fiber.Map{"error":"invalid credentials"}) }
    if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(body.Password)); err != nil { return c.Status(401).JSON(fiber.Map{"error":"invalid credentials"}) }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"sub": u.UUID, "exp": time.Now().Add(24*time.Hour).Unix()})
    signed, _ := token.SignedString([]byte(uc.cfg.JWTSecret))
    return c.JSON(fiber.Map{"token": signed})
}
