package controllers

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"

	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/config"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/models"
	"github.com/rjrajnish/seo_AI_editor_project/cms-backend/internal/repositories"
)

type UserController struct{ Repo *repositories.UserRepo; Cfg config.Config }

func NewUserController(db *mongo.Database, cfg config.Config) *UserController {
	return &UserController{ Repo: repositories.NewUserRepo(db), Cfg: cfg }
}

func (u *UserController) Register(c *fiber.Ctx) error {
	var body struct{ Name, Email, Password string }
	if err := c.BodyParser(&body); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }
	hashed, _ := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	user := &models.User{ ID: primitive.NewObjectID(), UUID: primitive.NewObjectID().Hex(), Name: body.Name, Email: body.Email, PasswordHash: string(hashed), Role: "author", CreatedAt: primitive.NewDateTimeFromTime(time.Now()) }
	if err := u.Repo.Create(context.Background(), user); err != nil { return c.Status(500).JSON(fiber.Map{"error":err.Error()}) }
	return c.JSON(fiber.Map{"ok":true})
}

func (u *UserController) Login(c *fiber.Ctx) error {
	var body struct{ Email, Password string }
	if err := c.BodyParser(&body); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid"}) }
	user, err := u.Repo.FindByEmail(context.Background(), body.Email)
	if err != nil || user==nil { return c.Status(401).JSON(fiber.Map{"error":"invalid credentials"}) }
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password)); err != nil { return c.Status(401).JSON(fiber.Map{"error":"invalid credentials"}) }
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{ "user_id": user.ID, "user_name": user.Name,"user_role": user.Role, "user_UUID": user.UUID, "exp": time.Now().Add(24*time.Hour).Unix()})
	signed, _ := token.SignedString([]byte(u.Cfg.JWTSecret))
	return c.JSON(fiber.Map{"token": signed,"user_UUID": user.UUID})
}
