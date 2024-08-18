import z from "../node_modules/zod";

export const userLoginSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters long")
      .max(32, "Password must be less than 32 characters"),
    email: z
      .string()
      .or(z.string().email()),
    usn: z
      .string()
      .or(
        // z.object({ usn: z.string().length(10, "USN must be of length 10!") })
        z.string().length(10, "USN must be of length 10!")
      ),
  })
  .superRefine(({ email, usn }, context) => {
    if (email !== "" && usn !== "")
      context.addIssue({
        code: "custom",
        message: "Either login with email or usn, not both",
        path: ["email"],
      });
    if (email === "" && usn === "")
      context.addIssue({
        code: "custom",
        message: "Either usn or email needed!",
        path: ["email"],
      });
  });

export const teacherRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name needed!")
      .max(20, "Name must be less than 20 chars"),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    joiningDate: z.string().length(10, "Invalid format! Require: DD-MM-YYYY"),
  })
  .superRefine(({ confirmPassword, password }, context) => {
    if (confirmPassword !== password) {
      context.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    const isUpper = (ch: string) => /[A-Z]/.test(ch);
    const isLower = (ch: string) => /[a-z]/.test(ch);
    const isSpecial = (ch: string) =>
      /[`!@#$%^&*()_\-+=\\[\]{};':"\\|,.<>/?~\\]/.test(ch);

    let cntUpper = 0,
      cntLower = 0,
      cntSpec = 0,
      cntNum = 0;
    for (let i = 0; i < password.length; i++) {
      const c = password[i];
      if (!isNaN(+c)) cntNum++;
      else if (isUpper(c)) cntUpper++;
      else if (isLower(c)) cntLower++;
      else if (isSpecial(c)) cntSpec++;
    }

    if (!(cntUpper && cntLower && cntNum && cntSpec)) {
      context.addIssue({
        code: "custom",
        message:
          "Password must contain aleast 1 upper-case, 1 lower-case, 1 number and 1 special charater!",
        path: ["confirmPassword"],
      });
    }
  });

export const studentRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name needed!")
      .max(20, "Name must be less than 20 chars"),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    admissionDate: z.string().length(10, "Invalid format! Require: DD-MM-YYYY"),
  })
  .superRefine(({ confirmPassword, password }, context) => {
    if (confirmPassword !== password) {
      context.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    const isUpper = (ch: string) => /[A-Z]/.test(ch);
    const isLower = (ch: string) => /[a-z]/.test(ch);
    const isSpecial = (ch: string) =>
      /[`!@#$%^&*()_\-+=\\[\]{};':"\\|,.<>\\/?~ ]/.test(ch);

    let cntUpper = 0,
      cntLower = 0,
      cntSpec = 0,
      cntNum = 0;
    for (let i = 0; i < password.length; i++) {
      const c = password[i];
      if (!isNaN(+c)) cntNum++;
      else if (isUpper(c)) cntUpper++;
      else if (isLower(c)) cntLower++;
      else if (isSpecial(c)) cntSpec++;
    }

    if (!(cntUpper && cntLower && cntNum && cntSpec)) {
      context.addIssue({
        code: "custom",
        message:
          "Password must contain aleast 1 upper-case, 1 lower-case, 1 number and 1 special charater!",
        path: ["confirmPassword"],
      });
    }
  });
