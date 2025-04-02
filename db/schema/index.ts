import { blogContentsTable, sectionTypeEnum } from "./blogContentsModel";
import { blogsTable, blogStatusEnum, categoryEnum } from "./blogsModel";
import { blogContentsRelations, blogsRelations, usersRelations } from "./relations";
import { roleEnum, usersTable } from "./userModel";

// initialize relations
const usersWithBlogsRelations = usersRelations({ blogsTable });
const blogsWithUsersRelations = blogsRelations({ usersTable, blogContentsTable });
const blogContentsWithBlogsRelations = blogContentsRelations({ blogsTable });

export const schema = {
  // tables
  usersTable,
  blogsTable,
  blogContentsTable,
  // ?
  roleEnum,
  blogStatusEnum,
  categoryEnum,
  sectionTypeEnum,

  // relations
  usersWithBlogsRelations,
  blogsWithUsersRelations,
  blogContentsWithBlogsRelations,

}

export {
  // tables
  usersTable,
  blogsTable,
  blogContentsTable,

  // ano ba tawag d2 hahshsa
  roleEnum,
  blogStatusEnum,
  categoryEnum,
  sectionTypeEnum

}