
package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Article struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UUID string `bson:"uuid" json:"uuid"`
    Title string `bson:"title" json:"title"`
    Slug string `bson:"slug" json:"slug"`
    Content string `bson:"content" json:"content"`
    AuthorUUID string `bson:"author_uuid" json:"author_uuid"`
    Tags []string `bson:"tags" json:"tags"`
    SeoScore int `bson:"seo_score" json:"seo_score"`
    Published bool `bson:"published" json:"published"`
    CreatedAt primitive.DateTime `bson:"created_at" json:"created_at"`
    UpdatedAt primitive.DateTime `bson:"updated_at" json:"updated_at"`
}
