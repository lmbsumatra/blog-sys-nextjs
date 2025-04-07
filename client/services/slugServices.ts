import { db } from "@/db";
import { eq } from "drizzle-orm";
import { schema } from "@/db/schema";

async function generateSlug(title: string): Promise<string> {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let isUnique = false;
    while (!isUnique) {
        const existingBlog = await db.query.blogsTable.findFirst({
            where: eq(schema.blogsTable.slug, slug)

        });

        if (existingBlog) {
            const randomNumber = Math.floor(1000 + Math.random() * 9000);
            slug = `${baseSlug}-${randomNumber}`;
        } else {
            isUnique = true;
        }
    }

    return slug;
}

const SlugServices = {
    generateSlug,
    generateUniqueSlug
};

export default SlugServices;
