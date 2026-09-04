import { Webhook } from "svix";
import User from "../models/User.js";


// ========================================
// CLERK WEBHOOK CONTROLLER
// ========================================

export const clerkWebhooks = async (
  req,
  res
) => {
  try {

    console.log(
      "================================"
    );

    console.log(
      "CLERK WEBHOOK RECEIVED"
    );

    console.log(
      "================================"
    );


    // ========================================
    // GET SVIX HEADERS
    // ========================================

    const svixId =
      req.headers["svix-id"];

    const svixTimestamp =
      req.headers["svix-timestamp"];

    const svixSignature =
      req.headers["svix-signature"];


    // ========================================
    // CHECK HEADERS
    // ========================================

    if (
      !svixId ||
      !svixTimestamp ||
      !svixSignature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing Svix headers",
      });
    }


    // ========================================
    // CHECK WEBHOOK SECRET
    // ========================================

    if (
      !process.env
        .CLERK_WEBHOOK_SECRET
    ) {
      console.log(
        "CLERK_WEBHOOK_SECRET is missing"
      );

      return res.status(500).json({
        success: false,
        message:
          "Webhook secret is not configured",
      });
    }


    // ========================================
    // CREATE WEBHOOK INSTANCE
    // ========================================

    const whook =
      new Webhook(
        process.env
          .CLERK_WEBHOOK_SECRET
      );


    // ========================================
    // VERIFY WEBHOOK
    //
    // req.body is RAW BUFFER
    // ========================================

    const payload =
      whook.verify(
        req.body.toString(),
        {
          "svix-id":
            svixId,

          "svix-timestamp":
            svixTimestamp,

          "svix-signature":
            svixSignature,
        }
      );


    // ========================================
    // GET EVENT DATA
    // ========================================

    const {
      data,
      type,
    } = payload;


    console.log(
      "WEBHOOK TYPE:",
      type
    );

    console.log(
      "CLERK USER ID:",
      data.id
    );


    // ========================================
    // USER CREATED
    // ========================================

    if (
      type === "user.created"
    ) {

      const userData = {

        _id:
          data.id,

        email:
          data.email_addresses?.[0]
            ?.email_address || "",

        name:
          `${data.first_name || ""} ${
            data.last_name || ""
          }`.trim(),

        image:
          data.image_url || "",

        resume:
          "",
      };


      console.log(
        "CREATING USER:",
        userData
      );


      const user =
        await User.findByIdAndUpdate(

          data.id,

          userData,

          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }

        );


      console.log(
        "USER SAVED SUCCESSFULLY:"
      );

      console.log(user);

    }


    // ========================================
    // USER UPDATED
    // ========================================

    else if (
      type === "user.updated"
    ) {

      const user =
        await User.findByIdAndUpdate(

          data.id,

          {

            email:
              data.email_addresses?.[0]
                ?.email_address || "",

            name:
              `${
                data.first_name || ""
              } ${
                data.last_name || ""
              }`.trim(),

            image:
              data.image_url || "",

          },

          {
            new: true,
            upsert: true,
          }

        );


      console.log(
        "USER UPDATED:",
        user
      );

    }


    // ========================================
    // USER DELETED
    // ========================================

    else if (
      type === "user.deleted"
    ) {

      if (data.id) {

        await User.findByIdAndDelete(
          data.id
        );


        console.log(
          "USER DELETED:",
          data.id
        );

      }

    }


    // ========================================
    // OTHER EVENTS
    // ========================================

    else {

      console.log(
        "UNHANDLED EVENT:",
        type
      );

    }


    // ========================================
    // SUCCESS RESPONSE
    // ========================================

    return res.status(200).json({

      success: true,

      message:
        "Webhook processed successfully",

    });

  }

  catch (error) {

    console.error(
      "================================"
    );

    console.error(
      "WEBHOOK ERROR:"
    );

    console.error(error);

    console.error(
      "================================"
    );


    return res.status(400).json({

      success: false,

      message:
        error.message,

    });

  }

};