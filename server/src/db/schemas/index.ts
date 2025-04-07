import { usersTable, usersRelations, roleEnum } from "./UserModel";

import { blogsTable, blogsRelations, blogStatusEnum, categoryEnum } from "./BlogsModel";
import {
  blogContentsTable,
  blogContentsRelations,
  sectionTypeEnum,
} from "./BlogContentsModel";

export const schema = {
  usersTable,
  blogsTable,
  blogContentsTable,
  categoryEnum,
  roleEnum,
  blogStatusEnum,
  sectionTypeEnum,
  usersRelations: usersRelations({ blogsTable }),
  blogContentsRelations: blogContentsRelations({ blogsTable }),
  blogsRelations: blogsRelations({ usersTable, blogContentsTable }),
};

