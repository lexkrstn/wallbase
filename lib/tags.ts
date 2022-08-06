import Tag from "../interfaces/tag";

export async function getPopularTags(): Promise<Tag[]> {
  return [...new Array(14)].map((_, i) => (
    {
      id: i,
      name: Math.random() < 0.5 ? 'Cattie Perrie' : 'Bill Gates',
      purity: Math.round(Math.random() * 2 + 1),
      count: 123,
      category: {
        id: 1,
        name: 'Celebrities',
        count: 100,
      },
    }
  ));
}