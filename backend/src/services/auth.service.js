
export const createAccount = async (data) => {
    // Verify email is not taken
    const existingUser = await UserModel.exists({ email: data.email });
  
    if (existingUser) {
      throw new Error("Email is already in use");
    }
  
    // Continue with account creation (e.g., hashing password, saving user)
    // ...
  
    return { success: true, message: "Account created successfully" };
  };
  