import { User } from "../auth/types";

// Example API functions that could be wrapped with MCP
export interface ExampleData {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export const getExampleData = async (user: User): Promise<ExampleData[]> => {
  // Simulate fetching user-specific data
  return [
    {
      id: "1",
      name: "Example Item 1",
      description: "This is an example item",
      userId: user.id,
      createdAt: new Date().toISOString(),
    },
  ];
};

export const createExampleData = async (
  data: { name: string; description: string },
  user: User,
): Promise<ExampleData> => {
  // Simulate creating new data
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: data.name,
    description: data.description,
    userId: user.id,
    createdAt: new Date().toISOString(),
  };
};

export const updateExampleData = async (
  id: string,
  data: { name?: string; description?: string },
  user: User,
): Promise<ExampleData> => {
  // Simulate updating data (with ownership check)
  const existing = await getExampleData(user);
  const item = existing.find((item) => item.id === id);

  if (!item) {
    throw new Error("Item not found or access denied");
  }

  return {
    ...item,
    ...data,
    updatedAt: new Date().toISOString(),
  };
}; 