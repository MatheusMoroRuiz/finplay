import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) return NextResponse.error();

    const body = await request.text();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-10-28.acacia",
    });

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("📥 Webhook recebido:", event.type);

    // ================================================================
    // 🔥 invoice.paid → Assinatura criada e pagamento confirmado
    // ================================================================
    if (event.type === "invoice.paid") {
      const invoice = event.data.object;

      // NOVA API DO STRIPE (2024) — subscription fica AQUI
      const subscriptionInfo = invoice?.parent?.subscription_details;

      if (!subscriptionInfo) {
        console.log("⚠ Não encontrou subscription_details (não é assinatura)");
        return NextResponse.json({ received: true });
      }

      const subscriptionId = subscriptionInfo.subscription;
      const clerkUserId = subscriptionInfo.metadata?.clerk_user_id;

      console.log("🔍 subscriptionId:", subscriptionId);
      console.log("🔍 clerkUserId:", clerkUserId);

      if (!clerkUserId) {
        console.error("❌ clerk_user_id ausente no metadata!");
        return NextResponse.error();
      }

      // Buscar subscription para obter customer
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      await clerkClient.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: subscription.customer,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });

      console.log("✅ Assinatura PREMIUM registrada no Clerk");
    }

    // ================================================================
    // 🔥 customer.subscription.deleted → Assinatura cancelada
    // ================================================================
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const clerkUserId = subscription.metadata?.clerk_user_id;

      if (!clerkUserId) {
        console.error("❌ clerk_user_id ausente na deleção");
        return NextResponse.error();
      }

      await clerkClient.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        publicMetadata: {
          subscriptionPlan: null,
        },
      });

      console.log("🟦 Assinatura removida do usuário no Clerk");
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ ERRO NO WEBHOOK:", err.message);
    return NextResponse.error();
  }
};
