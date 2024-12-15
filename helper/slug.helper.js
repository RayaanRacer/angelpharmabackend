export function generateSlug(name) {
  // Convert the name to lowercase, remove special characters, and replace spaces with dashes
  const slugFromName = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word characters
    .replace(/\s+/g, "-"); // Replace spaces with dashes

  // Get the current timestamp
  const timestamp = Date.now();

  // Optional: Add a unique identifier (e.g., for uniqueness)
  const uniqueId = Math.random().toString(36).substring(2, 7);

  // Combine everything to form the final slug
  const slug = `${slugFromName}-${timestamp}-${uniqueId}`;

  return slug;
}
