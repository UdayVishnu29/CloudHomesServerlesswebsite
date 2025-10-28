const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get all properties
export const getProperties = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Get property by ID
export const getPropertyById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Property not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.property;
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error;
  }
};

// Create new property
export const createProperty = async (propertyData) => {
  try {
    // Get current user from Cognito
    const { getCurrentUser } = await import("./auth");
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User must be logged in to create property");
    }

    const propertyWithUser = {
      ...propertyData,
      userId: user.username || user.attributes.sub,
    };

    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyWithUser),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

// Get user's properties
export const getUserProperties = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/properties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error("Error fetching user properties:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Image Upload Functions
export const generateUploadUrl = async (fileName, fileType) => {
  try {
    console.log("Calling upload-url API with:", fileName, fileType);

    const response = await fetch(`${API_BASE_URL}/properties/upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName,
        fileType,
      }),
    });

    console.log("Upload URL response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Upload URL response data:", data);
    return data;
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw error;
  }
};
export const generateImageUrl = async (fileKey) => {
  try {
    console.log("🔄 generateImageUrl called with fileKey:", fileKey);

    if (!fileKey) {
      throw new Error("fileKey is required");
    }

    const url = `${API_BASE_URL}/properties/image-url?fileKey=${encodeURIComponent(
      fileKey
    )}`;
    console.log("📡 Calling image-url API:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("📨 Image URL response status:", response.status);

    if (!response.ok) {
      console.error(
        "❌ Image URL API failed:",
        response.status,
        response.statusText
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Image URL response data:", data);

    if (!data.imageUrl) {
      throw new Error("No imageUrl in response");
    }

    return data.imageUrl;
  } catch (error) {
    console.error("💥 Error generating image URL:", error);
    throw error; // Re-throw to handle in component
  }
};
