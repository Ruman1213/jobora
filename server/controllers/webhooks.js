import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook received");

    const whook = new Webhook(
      process.env.CLERK_WEBHOOK_SECRET
    );

    const payload = whook.verify(
      JSON.stringify(req.body),
      {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      }
    );

    const { data, type } = payload;

    console.log("Webhook type:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email:
            data.email_addresses?.[0]?.email_address || "",
          name:
            `${data.first_name || ""} ${
              data.last_name || ""
            }`.trim(),
          image: data.image_url || "",
          resume: "",
        };

        await User.findByIdAndUpdate(
          data.id,
          userData,
          {
            new: true,
            upsert: true,
          }
        );

        console.log(
          "User stored successfully:",
          data.id
        );

        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(
          data.id,
          {
            email:
              data.email_addresses?.[0]?.email_address || "",
            name:
              `${data.first_name || ""} ${
                data.last_name || ""
              }`.trim(),
            image: data.image_url || "",
          },
          {
            new: true,
          }
        );

        console.log(
          "User updated successfully:",
          data.id
        );

        break;
      }

      case "user.deleted": {
        if (data.id) {
          await User.findByIdAndDelete(data.id);

          console.log(
            "User deleted successfully:",
            data.id
          );
        }

        break;
      }

      default:
        console.log(
          "Unhandled webhook type:",
          type
        );
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });

  } catch (error) {
    console.error(
      "Webhook Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};