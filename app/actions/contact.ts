"use server";

export async function submitContactForm(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!firstName || !lastName || !email || !message) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please provide a valid email address.",
    };
  }

  try {
    // Here you would typically:
    // 1. Save to database (using Prisma)
    // 2. Send email notification (using Resend, SendGrid, etc.)
    // 3. Add to CRM or notification system

    // For now, we'll simulate a successful submission
    console.log("Contact form submission:", {
      firstName,
      lastName,
      email,
      phone,
      service,
      message,
      submittedAt: new Date().toISOString(),
    });

    // In a real implementation, you would save to your database:
    // await prisma.contactSubmission.create({
    //   data: {
    //     firstName,
    //     lastName,
    //     email,
    //     phone: phone || null,
    //     service: service || null,
    //     message,
    //   },
    // });

    // And send an email notification
    // await sendEmail({
    //   to: "cpacaguas@mymail.mapua.edu.ph",
    //   subject: `New contact form submission from ${firstName} ${lastName}`,
    //   body: message,
    // });

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
