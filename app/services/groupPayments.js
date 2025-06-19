import { paymentsApi } from "./api";

// Fetch group payments by group id
export const getGroupPayments = async (groupId) => {
  try {
    // API endpoint: /api/v1/payments/group/<groupId>/
    const response = await paymentsApi.get(`group/${groupId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching group payments:", error);
    throw error;
  }
};
