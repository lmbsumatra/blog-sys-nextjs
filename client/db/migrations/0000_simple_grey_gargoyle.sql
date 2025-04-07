CREATE TYPE "public"."blog_status" AS ENUM('unpublish', 'published');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('Personal', 'Electronics', 'Gadgets', 'Documents', 'ID', 'Wearables', 'Accessories', 'Clothing', 'School Materials', 'Others');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'superadmin');--> statement-breakpoint
CREATE TYPE "public"."section_type" AS ENUM('header', 'list', 'image', 'text', 'quote');--> statement-breakpoint
CREATE TABLE "contents" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_id" integer NOT NULL,
	"section_type" "section_type" NOT NULL,
	"content" text,
	"index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text,
	"description" text,
	"banner" varchar(500) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" "category" DEFAULT 'Others',
	"blog_status" "blog_status" DEFAULT 'unpublish',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"middle_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;