import { asyncResponse, generateId } from "../utils";
import { expenses, expenseCategories } from "../mock/expenses";

/**
 * Get all expenses
 * @returns {Promise<Array>} - List of expenses
 */
export const getExpenses = async () => {
  return asyncResponse([...expenses]);
};

/**
 * Get expense by ID
 * @param {number} id - Expense ID
 * @returns {Promise<Object>} - Expense data
 */
export const getExpenseById = async (id) => {
  const expense = expenses.find((expense) => expense.id === id);
  if (!expense) {
    throw new Error("Expense not found");
  }
  return asyncResponse({ ...expense });
};

/**
 * Add new expense
 * @param {Object} expenseData - Expense data
 * @returns {Promise<Object>} - Created expense
 */
export const addExpense = async (expenseData) => {
  const newExpense = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...expenseData,
  };
  expenses.push(newExpense);

  // Update category stats
  if (expenseData.categoryId) {
    const categoryIndex = expenseCategories.findIndex(
      (c) => c.id === expenseData.categoryId
    );
    if (categoryIndex !== -1) {
      expenseCategories[categoryIndex].expensesCount += 1;
      expenseCategories[categoryIndex].totalSpent += parseFloat(
        expenseData.amount
      );
    }
  }

  return asyncResponse(newExpense);
};

/**
 * Update expense
 * @param {number} id - Expense ID
 * @param {Object} expenseData - Expense data to update
 * @returns {Promise<Object>} - Updated expense
 */
export const updateExpense = async (id, expenseData) => {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error("Expense not found");
  }

  const oldAmount = expenses[index].amount;
  const oldCategoryId = expenses[index].categoryId;
  const newAmount =
    expenseData.amount !== undefined
      ? parseFloat(expenseData.amount)
      : oldAmount;
  const newCategoryId =
    expenseData.categoryId !== undefined
      ? expenseData.categoryId
      : oldCategoryId;

  // Update category stats if amount or category changed
  if (oldAmount !== newAmount || oldCategoryId !== newCategoryId) {
    // Update old category stats
    if (oldCategoryId) {
      const oldCategoryIndex = expenseCategories.findIndex(
        (c) => c.id === oldCategoryId
      );
      if (oldCategoryIndex !== -1) {
        expenseCategories[oldCategoryIndex].totalSpent -= oldAmount;
        expenseCategories[oldCategoryIndex].expensesCount -= 1;
      }
    }

    // Update new category stats
    if (newCategoryId) {
      const newCategoryIndex = expenseCategories.findIndex(
        (c) => c.id === newCategoryId
      );
      if (newCategoryIndex !== -1) {
        expenseCategories[newCategoryIndex].totalSpent += newAmount;
        expenseCategories[newCategoryIndex].expensesCount += 1;
      }
    }
  }

  expenses[index] = { ...expenses[index], ...expenseData };
  return asyncResponse(expenses[index]);
};

/**
 * Delete expense
 * @param {number} id - Expense ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteExpense = async (id) => {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) {
    throw new Error("Expense not found");
  }

  // Update category stats
  const categoryId = expenses[index].categoryId;
  if (categoryId) {
    const categoryIndex = expenseCategories.findIndex(
      (c) => c.id === categoryId
    );
    if (categoryIndex !== -1) {
      expenseCategories[categoryIndex].expensesCount -= 1;
      expenseCategories[categoryIndex].totalSpent -= expenses[index].amount;
    }
  }

  expenses.splice(index, 1);
  return asyncResponse({ success: true });
};

/**
 * Get all expense categories
 * @returns {Promise<Array>} - List of expense categories
 */
export const getExpenseCategories = async () => {
  return asyncResponse([...expenseCategories]);
};

/**
 * Get expense category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object>} - Category data
 */
export const getExpenseCategoryById = async (id) => {
  const category = expenseCategories.find((category) => category.id === id);
  if (!category) {
    throw new Error("Expense category not found");
  }
  return asyncResponse({ ...category });
};

/**
 * Add expense category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} - Created category
 */
export const addExpenseCategory = async (categoryData) => {
  const newCategory = {
    id: generateId(),
    expensesCount: 0,
    totalSpent: 0.0,
    isActive: true,
    createdAt: new Date().toISOString(),
    ...categoryData,
  };
  expenseCategories.push(newCategory);
  return asyncResponse(newCategory);
};

/**
 * Update expense category
 * @param {number} id - Category ID
 * @param {Object} categoryData - Category data to update
 * @returns {Promise<Object>} - Updated category
 */
export const updateExpenseCategory = async (id, categoryData) => {
  const index = expenseCategories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Expense category not found");
  }

  expenseCategories[index] = { ...expenseCategories[index], ...categoryData };
  return asyncResponse(expenseCategories[index]);
};

/**
 * Delete expense category
 * @param {number} id - Category ID
 * @returns {Promise<Object>} - Success status
 */
export const deleteExpenseCategory = async (id) => {
  const index = expenseCategories.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error("Expense category not found");
  }

  // Check if category has expenses
  if (expenseCategories[index].expensesCount > 0) {
    throw new Error("Cannot delete category with associated expenses");
  }

  expenseCategories.splice(index, 1);
  return asyncResponse({ success: true });
};
