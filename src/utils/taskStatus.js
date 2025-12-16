export const calculateStatusFromDueDate = (due_at) => {
  if (!due_at) return "pending";

  const today = new Date();
  const dueDate = new Date(due_at);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today ? "overdue" : "pending";
};
