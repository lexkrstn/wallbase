import { KeysToCamelCase } from "@/lib/helpers/type-case";
import { CategoryRow } from "@/lib/server/interfaces";

/**
 * Represents the tag category.
 */
export default interface Category extends KeysToCamelCase<CategoryRow> {}
