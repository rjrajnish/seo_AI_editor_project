package controllers

import (
	"context"
	"strings"
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

type UserController struct {
	Repo *repositories.UserRepo
	Cfg  config.Config
}

func NewUserController(db *mongo.Database, cfg config.Config) *UserController {
	return &UserController{Repo: repositories.NewUserRepo(db), Cfg: cfg}
}

func normalizeRole(role string) string {
	r := strings.ToLower(strings.TrimSpace(role))
	switch r {
	case "admin", "staff", "author", "student":
		return r
	default:
		return "author"
	}
}

func (u *UserController) Register(c *fiber.Ctx) error {
	var body struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
	}

	body.Name = strings.TrimSpace(body.Name)
	body.Email = strings.ToLower(strings.TrimSpace(body.Email))
	body.Password = strings.TrimSpace(body.Password)
	if body.Name == "" || body.Email == "" || body.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "name, email and password are required"})
	}
	if len(body.Password) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "password must be at least 6 characters"})
	}

	existing, err := u.Repo.FindByEmail(context.Background(), body.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "unable to verify account"})
	}
	if existing != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "email already registered"})
	}

	hashed, hashErr := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if hashErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "password processing failed"})
	}

	user := &models.User{
		ID:           primitive.NewObjectID(),
		UUID:         primitive.NewObjectID().Hex(),
		Name:         body.Name,
		Email:        body.Email,
		PasswordHash: string(hashed),
		Role:         normalizeRole(body.Role),
		CreatedAt:    primitive.NewDateTimeFromTime(time.Now()),
	}

	if createErr := u.Repo.Create(context.Background(), user); createErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": createErr.Error()})
	}
	return c.JSON(fiber.Map{"ok": true})
}

func (u *UserController) Login(c *fiber.Ctx) error {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
	}

	body.Email = strings.ToLower(strings.TrimSpace(body.Email))
	body.Password = strings.TrimSpace(body.Password)
	if body.Email == "" || body.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "email and password are required"})
	}

	user, err := u.Repo.FindByEmail(context.Background(), body.Email)
	if err != nil || user == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(body.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":   user.ID,
		"user_name": user.Name,
		"user_role": user.Role,
		"user_UUID": user.UUID,
		"exp":       time.Now().Add(24 * time.Hour).Unix(),
	})

	signed, signErr := token.SignedString([]byte(u.Cfg.JWTSecret))
	if signErr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "unable to generate token"})
	}

	return c.JSON(fiber.Map{"token": signed, "user_UUID": user.UUID})
}
